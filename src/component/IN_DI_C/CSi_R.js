import "./INDI_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import TeX from "@matejmazur/react-katex";
import { evaluate, compile } from "mathjs";
import nerdamer from "nerdamer/all.min";

//* Composite Simpson Rule //

const CSi_R = () => {
  const [X0, setX0] = useState(0);
  const [XN, setXN] = useState(0);
  const [N, setN] = useState(0);
  const [Fun, setFun] = useState("");

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);

  const inputX0 = (event) => {
    setX0(event.target.value);
  };

  const inputN = (event) => {
    setN(event.target.value);
  };

  const inputXN = (event) => {
    setXN(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    Composite_Simpson_Rule();
    setX0(0);
    setXN(0);
    setN(0);
    setFun("");
  };

  const Composite_Simpson_Rule = () => {
    //!-----------------------------------------------------------

    function fx(fsx, X) {
      var math = compile(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    function true_err(Actual, normal) {
      var E = Math.abs((Actual - normal) / Actual) * 100;
      return E.toFixed(6);
    }

    function cal_Xi(a, i, h) {
      var Xi = a + i * h;
      return Xi;
    }

    //!-----------------------------------------------------------

    //EXP n, a, b, fun

    let a = Number(X0),
      b = Number(XN),
      n = Number(N);
    var funct = Fun;

    var inte = "integrate(" + funct + ", x)";
    var inte_funct = nerdamer(inte);

    var h = (b - a) / n;
    var summat_fun_odd = 0;
    var summat_fun_even = 0;

    for (let i = 1, Xi = 0; i <= n - 1; i++) {
      Xi = cal_Xi(a, i, h);
      if (i % 2 == 0) {
        summat_fun_even += fx(funct, Xi);
      } else {
        summat_fun_odd += fx(funct, Xi);
      }
    }

    var fx0 = fx(funct, a);
    var fxn = fx(funct, b);
    var fx_even = 2 * summat_fun_even;
    var fx_odd = 4 * summat_fun_odd;

    var Ifux0 = fx(inte_funct.toString(), a);
    var IfuxN = fx(inte_funct.toString(), b);

    var I = (h / 3) * (fx0 + fxn + fx_even + fx_odd);
    var I_ans = IfuxN + Ifux0;

    var err = true_err(I_ans, I);

    setAnswer(
      <p className="AnswerStyle">
        ค่าความผิดพลาด <b> (Error) </b> ในการคาดเดา เท่ากับ &nbsp;{" "}
        <i style={{ color: "red" }}>E</i> = <b>{err}</b>{" "}
      </p>
    );

    const tag1 = (<TeX math=" \int^{\bm {X_{n}}}_{\bm {X_{0}}} \bm {F({X_{0}})} \bm {dx}" />);
    const tag2 = (<TeX math=" \int^{\bm {X_{n}}}_{\bm {X_{0}}} \bm {F({X_{N}})} \bm {dx}" />);

    setOut(

        <div className="OutputText" id="myout">
          <h1 style={{marginBottom: 40}}> Summary : </h1>

          <div style={{display: "flex" , justifyContent:"flex-start"}}>

          <section>
          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm X_0" /> : </b> {a} </p>
          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm F(X_{0})" /> : </b> {fx0} </p>
          </section>

          <section>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm X_N" /> : </b> {b} </p>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm F(X_{N})" /> : </b> {fxn}  </p> 
          </section>

          </div>

          <p> <b style={{ fontSize: 25 }}> n = {n} &nbsp; : </b> </p>
          <p style={{textIndent: "10%"}}> <b style={{ fontSize: 22 }}> ตำแหน่งเลขคี่ &nbsp; : &nbsp; <TeX math=" \bm 4\sum_{\substack{i=1,3,5,...}}^{n-1} F(X_{i})" /> = </b> {fx_odd}  </p>
          <p style={{textIndent: "10%"}}> <b style={{ fontSize: 22 }}> ตำแหน่งเลขคู่ &nbsp; :  &nbsp; <TeX math=" \bm 2\sum_{\substack{i=2,4,6,...}}^{n-2} F(X_{i})" /> = </b> {fx_even}  </p> 

          <br/>

          <h2 style={{paddingBottom: "0%"}}> Actual Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> {tag1} : </b> {Ifux0.toFixed(6)} </p>
          <p> <b style={{ fontSize: 22 }}> {tag2} : </b> {IfuxN.toFixed(6)} </p>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \textcolor{red} {\bm {Integrate_{Actual}}} : I_{Actual}"/> = {tag2} + {tag1} </b></p>
          <p style={{textIndent: "21.5%"}}> <b style={{ fontSize: 22 }}> <TeX math="I_{Actual}"/> = {I_ans.toFixed(6)}</b> </p>

          <br />

          <h2 style={{ paddingBottom: "0%"}}> Predict Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> h : <TeX math="\cfrac{b-a}{n}"/> &nbsp; = {h} </b> </p>
          <p> <b style={{ fontSize: 22 }}> 
            <TeX math=" \textcolor{red} {\bm {Integrate_{Predict}}}"/> : 
            <TeX math="I_{Predict} = \cfrac{h}{3} \bigg( F(X_{0}) + F(X_{n}) + 4\sum_{\substack{i=1,3,5,...}}^{n-1} F(X_{i}) 
                + 2\sum_{\substack{i=2,4,6,...}}^{n-2} F(X_{i}) \bigg)  " /></b></p>
          <p style={{textIndent: "21.5%"}}> <b style={{ fontSize: 22 }}> <TeX math="I_{Predict}"/> =  {I.toFixed(6)} </b> </p>

          <br />

        </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Composite Simpson Rule</h1>
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

      <br />

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล <TeX math="X_{N}" />
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่าตัวเลข 1 ค่า(ต้องมากกว่า X0)"
          aria-describedby="texthelp2"
          onChange={inputXN}
          value={XN}
        />
        <Form.Text
          id="texthelp2"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น. (ตัว N ไม่เกี่ยวข้องกับค่า n
          ด้านล่าง)
        </Form.Text>
      </Form.Group>

      <br />

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล N
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่าตัวเลข 1 ค่า"
          aria-describedby="texthelp2"
          onChange={inputN}
          value={N}
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
};

export default CSi_R;

// var a = -1,
//   b = 2;
// var funct = "x^7 + 2x^3 - 1";
// console.log("function = " + funct);

// cal_simpson(2 , a , b , funct);
// cal_simpson(4 , a , b , funct);
// cal_simpson(6 , a , b , funct);
