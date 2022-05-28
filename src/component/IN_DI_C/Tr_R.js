import "./INDI_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import TeX from "@matejmazur/react-katex";
import { evaluate, compile } from "mathjs";
import nerdamer from "nerdamer/all.min";
import axios from "axios";

//? Trapezoial Rule //

const Tr_R = () => {
  const [X0, setX0] = useState(0);
  const [X1, setX1] = useState(0);
  const [Fun, setFun] = useState("");

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);

  const inputX0 = (event) => {
    setX0(event.target.value);
  };

  const inputX1 = (event) => {
    setX1(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    Trapezoial_rule();
    setX0(0);
    setX1(0);
    setFun("");
  };

  function callAPI() {
    const headers = {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
    };
    axios
      .get("http://localhost:4000/api/IntegrateAndDifferentiation", { headers })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id === "Trapezoial") {
            setX0(response.data.result[i].X0);
            setX1(response.data.result[i].X1);
            setFun(response.data.result[i].Fun);
          }
        }
      });
  }

  const Trapezoial_rule = () => {
    //!---------------------------------------------------------

    function fx(fsx, X) {
      var math = compile(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    function true_err(Actual, normal) {
      var E = Math.abs((Actual - normal) / Actual) * 100;
      return E.toFixed(6);
      //   console.log("True Error = " + E.toFixed(6) + " % ");
    }

    //!---------------------------------------------------------

    let a = Number(X0),
      b = Number(X1);
    var funct = Fun;

    var inte = "integrate(" + funct + ", x)";
    var inte_funct = nerdamer(inte);

    //* var inte_funct = nerdamer("integrate(4*x^5 - 3*x^4 + x^3 - 6*x + 2, x)");

    var fx0 = fx(funct, a);
    var fx1 = fx(funct, b);

    var Ifux0 = fx(inte_funct.toString(), a);
    var Ifux1 = fx(inte_funct.toString(), b);

    var I = ((b - a) / 2.0) * (fx0 + fx1);
    var I_ans = Ifux1 + Ifux0;
    var err = true_err(I_ans, I);

    // console.log("Predict answer = " + I);
    // console.log("Actual answer = " + I_ans);

    setAnswer( 
      <p className="AnswerStyle">
        ค่าความผิดพลาด <b> (Error) </b> ในการคาดเดา เท่ากับ &nbsp; <i style={{color: 'red'}}>E</i> = {" "}
        <b>{err}</b>{" "}
      </p>
    );

    const tag1 = (<TeX math=" \int^{\bm {X{1}}}_{\bm {X_{0}}} \bm {F({X_{1}})} \bm {dx}" />);
    const tag = (<TeX math="\int^{\bm {X{1}}}_{\bm {X_{0}}} \bm {F({X_{0}})} \bm {dx}" />);

      setOut(
        <div className="OutputText" id="myout">
          <h1 style={{marginBottom: 40}}> Summary : </h1>

          <div style={{display: "flex" , justifyContent:"flex-start"}}>

          <section>
          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm X_0" /> : </b> {a} </p>
          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm F(X_{0})" /> : </b> {fx0} </p>
          </section>

          <section>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm X_1" /> : </b> {b} </p>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \bm F(X_{1})" /> : </b> {fx1}  </p> 
          </section>

          </div>


          <br/>

          <h2 style={{paddingBottom: "0%"}}> Actual Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> {tag} : </b> {Ifux0.toFixed(6)} </p>
          <p> <b style={{ fontSize: 22 }}> {tag1} : </b> {Ifux1.toFixed(6)} </p>
          <p> <b style={{ fontSize: 22 }}> <TeX math=" \textcolor{red} {\bm {Integrate_{Actual}}} : I_{Actual}"/> = {tag} + {tag1} </b></p>
          <p> <b style={{ fontSize: 22 , color:"red" }}> <TeX math=" \bm {Integrate_{Actual}}"/> : </b> {I_ans.toFixed(6)} </p>

          <br />

          <h2 style={{ paddingBottom: "0%"}}> Predict Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> 
            <TeX math=" \textcolor{red} {\bm {Integrate_{Predict}}}"/> : 
            <TeX math="I_{Predict} = \cfrac{b-a}{2} \bigg( F(X_{0}) + F(X_{1}) \bigg)" /></b></p>
          <p style={{textIndent: "21.5%"}}> <b style={{ fontSize: 22 }}> <TeX math="I_{Predict}"/> =  {I.toFixed(6)} </b> </p>

          <br />

        </div>
      );

    }

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Trapezoial_rule </h1>
      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล <TeX math="X_{0}"/>
        </Form.Label>
        <Form.Control
          type="text"
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
          ค่าข้อมูล <TeX math="X_{1}"/>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่าตัวเลข 1 ค่า(ต้องมากกว่า X0)"
          aria-describedby="texthelp2"
          onChange={inputX1}
          value={X1}
        />
        <Form.Text
          id="texthelp2"
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

      <div>
        <Button variant="primary" size="lg" onClick={callAPI} className="btn">
          {" "}
          ตัวอย่าง{" "}
        </Button>{" "}
      </div>
      <br />

      <div id="myout">{output}</div>
      {answer}
    </Form>
  );
};

export default Tr_R;

/*  var a = 2,
      b = 8;
    var funct = "4x^5 - 3x^4 + x^3 - 6x + 2";

    
var inte = "integrate(" + funct + ", x)";
console.log(inte);
var inte_funct = nerdamer(inte);
console.log("Integrated function = " + inte_funct.toString());*/
