import "./INDI_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import TeX from "@matejmazur/react-katex";
import { evaluate, compile } from "mathjs";
import nerdamer from "nerdamer/all.min";

//* Simpson Rule //

const Si_R = () => {

    const [X0, setX0] = useState(0);
    const [X2, setX2] = useState(0);
    const [Fun, setFun] = useState("");

    //? X1 จะถูกคำนวณภายในฟังก์ชั่น (ลดการ input จากผู้ใช้)
  
    const [output, setOut] = useState(null);
    const [answer, setAnswer] = useState(null);

    const inputX0 = (event) => {
      setX0(event.target.value);
    };

    const inputX2 = (event) => {
      setX2(event.target.value);
    };

    const inputFun = (event) => {
      setFun(event.target.value);
    };

    const confirm_Num = (event) => {
      event.preventDefault();
      Simpson_Rule();
      setX0(0);
      setX2(0);
      setFun("");
    };
    

    const Simpson_Rule = () => {

        //!------------------------------

        function fx(fsx, X) {
          var math = compile(fsx);
          let scope = { x: X };
          return math.evaluate(scope);
        }

        function true_err(Actual, normal) {
          var E = Math.abs((Actual - normal) / Actual) * 100;
          return E.toFixed(6);
        }

        //!------------------------------

        let a = Number(X0),
          b = Number(X2),
          middle = (b + a) / 2.0;
        var funct = Fun;

        var inte = "integrate(" + funct + ", x)";
        var inte_funct = nerdamer(inte);

        var fx0 = fx(funct, a);
        var fx2 = fx(funct, b);
        var fx1 = fx(funct, middle);

        var Ifux0 = fx(inte_funct.toString(), a);
        var Ifux2 = fx(inte_funct.toString(), b);

        var I = ((b - a) / 6) * (fx0 + (4 * fx1) + fx2);
        var I_ans = Ifux2 + Ifux0;
     
        var err = true_err(I_ans, I);

        setAnswer( 
            <p className="AnswerStyle">
              ค่าความผิดพลาด <b> (Error) </b> ในการคาดเดา เท่ากับ &nbsp; <i style={{color: 'red'}}>E</i> = {" "}
              <b>{err}</b>{" "}
            </p>
          );

          const tag1 = (<TeX Math="\int^{\bm {X_{2}}}_{\bm {X_{0}}} \bm {F({X_{0}})} \bm {dx}" />);
          const tag2 = (<TeX Math="\int^{\bm {X_{2}}}_{\bm {X_{0}}} \bm {F({X_{2}})} \bm {dx}" />);

            setOut(
              <div className="OutputText" id="myout">
                <h1 style={{marginBottom: 40}}> Summary : </h1>
      
                <div style={{display: "flex" , justifyContent:"flex-start"}}>
      
                <section>
                <p> <b style={{ fontSize: 22}}> <TeX math=" \bm X_0" /> : </b> {a} </p>
                <p> <b style={{ fontSize: 22}}> <TeX math=" \bm F(X_{0})" /> : </b> {fx0} </p>
                </section>
      
                <section>
                <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm X_1" /> : </b> {middle} </p>
                <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm F(X_{1})" /> : </b> {fx1}  </p> 
                </section>

                <section>
                <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm X_2" /> : </b> {b} </p>
                <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm F(X_{2})" /> : </b> {fx2}  </p> 
                </section>
      
                </div>
      
                <br/>
      
                <h2 style={{paddingBottom: "0%"}}> Actual Integrate : </h2>
                <p> <b style={{ fontSize: 22 }}> {tag1} : </b> {Ifux0.toFixed(6)} </p>
                <p> <b style={{ fontSize: 22 }}> {tag2} : </b> {Ifux2.toFixed(6)} </p>
                <p> <b style={{ fontSize: 22 }}> <TeX math=" \textcolor{red} {\bm {Integrate_{Actual}}} : I_{Actual}"/> = {tag2} + {tag1} </b></p>
                <p style={{textIndent: "21.5%"}}> <b style={{ fontSize: 22 }}> <TeX math="I_{Actual}"/> = {I_ans.toFixed(6)}</b> </p>

                <br />

                <h2 style={{ paddingBottom: "0%"}}> Predict Integrate : </h2>
                <p> <b style={{ fontSize: 22 }}> 
                  <TeX math=" \textcolor{red} {\bm {Integrate_{Predict}}}"/> : 
                  <TeX math="I_{Predict} = \cfrac{b-a}{6} \bigg( F(X_{0}) + F(X_{2}) + 4F(X_{1}) \bigg)  " /></b>
                </p>
                <p style={{textIndent: "21.5%"}}> <b style={{ fontSize: 22 }}> <TeX math="I_{Predict}"/> =  {I.toFixed(6)} </b> </p>
                
                <br />
      
              </div>
            );
    }
    
    return (
      <Form onSubmit={confirm_Num} className="myform">
        <h1 className="myheader">Simpson Rule </h1>
        <Form.Group>
          <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
            ค่าข้อมูล <TeX math="X_{0}" />
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="ใส่ค่าตัวเลข 1 ค่า"
            aria-describedby="texthelp1"
            onChange={inputX0}
            value={X0}
          />
          <Form.Text
            id="texthelp1"
            muted
            style={{ fontSize: 15, color: "silver" }}
          >
            ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
          </Form.Text>
        </Form.Group>

        <p style={{color:"red" , fontSize: 18}}> ( ค่า <TeX math="X_{1}" /> จะถูกคำนวณโดยอัตโนมัติ )</p>

        <Form.Group>
          <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
            ค่าข้อมูล <TeX math="X_{2}" />
          </Form.Label>
          <Form.Control
            type="number"
            placeholder="ใส่ค่าตัวเลข 1 ค่า(ต้องมากกว่า X1)"
            aria-describedby="texthelp4"
            onChange={inputX2}
            value={X2}
          />
          <Form.Text
            id="texthelp4"
            muted
            style={{ fontSize: 15, color: "silver" }}
          >
            ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
          </Form.Text>
        </Form.Group>

        <br />

        <Form.Group>
          <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
            ฟังก์ชัน <TeX math="F(X)" /> สำหรับการคำนวณ
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="ใส่ฟังก์ชั่นที่ต้องการหา"
            aria-describedby="texthelp3"
            onChange={inputFun}
            value={Fun}
          />
          <Form.Text
            id="texthelp3"
            muted
            style={{ fontSize: 15, color: "silver" }}
          >
            ค่าข้อมูลต้องเป็นฟังก์ชั่นเท่านั้น.
          </Form.Text>
        </Form.Group>

        <br />

        <div>
          <Button variant="primary" size="lg" type="summit" className="btn">
            {" "}
            ยืนยัน{" "}
          </Button>{" "}
        </div>
        <br />
        <div id="myout">{output}</div>
        {answer}
      </Form>
    );
}

export default Si_R;


// var a = -1,
//   b = 2,
//   middle = (a+b) /2.0 ;
// var funct = "x^7 + 2x^3 - 1";
// console.log("function = " + funct);