import "./lsr_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import Plotly from "plotly.js-dist";
import TeX from "@matejmazur/react-katex";
import { multiply, inv, sum, transpose } from "mathjs";
import axios from "axios";

//MULTIPLE LINEAR REGRESSION

const MeL_R = () => {
  const [arr_X, setAX] = useState(["0"]);
  const [arr_X2, setAX2] = useState(["0"]);
  const [arr_X3, setAX3] = useState(["0"]);
  const [arr_Y, setAY] = useState(["0"]);
  const [X_find, setXF] = useState(["0"]);

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputAX = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setAX(temp);
  };

  const inputAX2 = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setAX2(temp);
  };

  const inputAX3 = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setAX3(temp);
  };

  const inputAY = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setAY(temp);
  };

  const inputXF = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setXF(temp);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    MULTIPLE_LINEAR_REGRESSION();
    setAX(["0"]);
    setAX2(["0"]);
    setAX3(["0"]);
    setAY(["0"]);
    setXF(["0"]);
  };

  function callAPI() {
    const headers = {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
    };
    axios
      .get("http://localhost:4000/api/Linear", { headers })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id === "MutlipleLinearRegression") {
            setAX(response.data.result[i].arr_X);
            setAX2(response.data.result[i].arr_X2);
            setAX3(response.data.result[i].arr_X3);
            setAY(response.data.result[i].arr_Y);
            setXF(response.data.result[i].X_find);
          }
        }
      });
  }

  const MULTIPLE_LINEAR_REGRESSION = () => {
    function another_Sum(x_arr, in1, in2) {
      var temp = 0;
      for (let j = 0; j < x_arr[0].length; j++) {
        temp += x_arr[in1][j] * x_arr[in2][j];
      }
      return temp;
    }

    function another_Sum_Y(x_arr, y_arr, k) {
      var temp = sum([y_arr]);
      if (k > 0) {
        for (let i = 0; i < x_arr.length; i++) {
          temp += x_arr[k - 1][i] * y_arr[i];
        }
      }
      return temp;
    }

    //!-----------------------------------------------

    let X = [arr_X.map((x) => Number(x))],
      Y = arr_Y.map((Y) => parseFloat(Y));
    let X_target = X_find.map((x) => Number(x));

    X.push(arr_X2.map((x2) => Number(x2)));
    X.push(arr_X3.map((x3) => Number(x3)));

    console.table(X);

    var n = X.length;
    var A = new Array(n + 1);
    var B = new Array(n + 1);
    var x = new Array(n);

    for (let i = 0; i < n + 1; i++) {
      A[i] = new Array(n + 1);
    }

    for (let i = 0; i < X.length; i++) {
      x[i] = 0;
      for (let j = 0; j < X[0].length; j++) {
        x[i] += X[i][j];
      }
    }

    for (let i = 0; i < n + 1; i++) {
      if (i == 0) {
        A[i][0] = X[0].length;
        for (let j = 1; j < n + 1; j++) {
          A[i][j] = x[j - 1];
          A[j][i] = A[i][j];
        }
        B[i] = sum([Y]);
      } else {
        for (let j = 1; j < n + 1; j++) {
          A[i][j] = another_Sum(X, i - 1, j - 1);
        }
        B[i] = another_Sum_Y(X, Y, i);
      }
    }

    var A_I = inv(A);
    var a = multiply(A_I, B);
    for (let i = 0; i < a.length; i++) {
      a[i] = Number(a[i].toFixed(4));
    }

    var answer = a[0];
    for (let i = 1; i < X_target.length - 1; i++) {
      answer += a[i] * X_target[i - 1];
    }

    setAnswer(
      <p className="AnswerStyle">
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <TeX math="Y_{target} = " />{" "}
        <b>{answer.toFixed(6)}</b>{" "}
      </p>
    );

    var trace1 = {
      // data สำหรับ plot กราฟ
      x: X,
      y: Y,
      mode: "lines+markers",
      type: "scatter",
      line: { shape: "spline" },
      hovertemplate: "<i><b>X</b></i>: %{x:.8f}" + "<br><b>Y</b>: %{y:.8f}<br>",
      name: "Input X , Y",
    };

    var trace2 = {
      x: [X_target], //X_find
      y: [answer],
      mode: "markers",
      type: "scatter",
      hovertemplate:
        "<i><b>X Target = </b></i>: %{x:.8f}<br>" +
        "<i><b>Y Answer = </b></i>: %{y:.8f}",
      name: "Answer",
      marker: {
        color: "rgb(220,20,60)",
        size: 10,
      },
    };

    var data = [trace1, trace2];

    var layout = {
      title: {
        text: "Linear Regression",
        font: {
          family: "FCRoundBold",
          size: 24,
        },
      },
      xaxis: {
        title: {
          font: {
            family: "FCRoundRegular",
            size: 18,
            color: "#7f7f7f",
          },
        },
        autorange: true,
        tickformat: ".2f",
      },
      yaxis: {
        title: {
          font: {
            family: "FCRoundRegular",
            size: 18,
            color: "#7f7f7f",
          },
        },
        autorange: true,
        tickformat: ".2f",
      },
    };
    setGraph(Plotly.newPlot("myChart", data, layout));

    const VecB_dep = (
      <TeX
        math="\begin{Bmatrix}
          \sum_{\substack{i=1}}^{n}  Y_{i} \\
          \sum_{\substack{i=1}}^{n}  X_{1i}Y_{i} \\
          \sum_{\substack{i=1}}^{n}  X_{2i}Y_{i} \\
          \sum_{\substack{i=1}}^{n}  X_{3i}Y_{i}
          \end{Bmatrix}"
      />
    );

    const MatA_dep = (
      <TeX
        math="A = \begin{Bmatrix} 
        n & \sum_{\substack{i=1}}^{n} X_{1i} & \sum_{\substack{i=1}}^{n} X_{2i} & \sum_{\substack{i=1}}^{n} X_{3i} \\
        \sum_{\substack{i=1}}^{n} X_{1i} & \sum_{\substack{i=1}}^{n} X_{1i} X_{1i} & \sum_{\substack{i=1}}^{n} X_{1i} X_{2i} & \sum_{\substack{i=1}}^{n} X_{1i} X_{3i} \\
        \sum_{\substack{i=1}}^{n} X_{2i} & \sum_{\substack{i=1}}^{n} X_{2i} X_{1i} & \sum_{\substack{i=1}}^{n} X_{2i} X_{2i} & \sum_{\substack{i=1}}^{n} X_{2i} X_{3i} \\
        \sum_{\substack{i=1}}^{n} X_{3i} & \sum_{\substack{i=1}}^{n} X_{3i} X_{1i} & \sum_{\substack{i=1}}^{n} X_{3i} X_{2i} & \sum_{\substack{i=1}}^{n} X_{3i} X_{3i} \\
        \end{Bmatrix}"
      />
    );

    const VecX_dep = (
      <TeX
        math="\begin{Bmatrix} 
          a_{0} \\ a_{1} \\ a_{2} \\ a_{3} 
          \end{Bmatrix}"
      />
    );

    const Mat_A_in_dep = <TeX math="A^{-1}" />;

    var arr = [];
    for (let index = 0; index < B.length; index++) {
      arr.push(<li>{String(B[index])}</li>);
    }

    const Vec_B = <ul className="bitem">{arr}</ul>;

    var arr2 = [];
    for (let index = 0; index < a.length; index++) {
      arr2.push(<li>{String(a[index].toFixed(6))}</li>);
    }

    const Vec_X = <ul className="bitem">{arr2}</ul>;

    var arr3 = [];
    var s_num = [];
    for (let index = 0; index < A.length; index++) {
      for (let j = 0; j < A[0].length; j++) {
        s_num.push(String(A[index][j]));
      }
      arr3.push(<li>{s_num.join(" , ")}</li>);
      s_num.length = 0;
    }

    const Mat_A = <ul className="bitem" style={{position: "absolute"}}>{arr3}</ul>;

    var arr4 = [];
    var s_num2 = [];
    for (let index = 0; index < A_I.length; index++) {
      for (let j = 0; j < A_I[0].length; j++) {
        s_num2.push(String(A_I[index][j].toFixed(6)));
      }
      arr4.push(<li>{s_num2.join(" , ")}</li>);
      s_num2.length = 0;
    }

    const Mat_A_in = <ul className="bitem" style={{position: "relative" , verticalAlign:"bottom"}}>{arr4}</ul>;

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}> X : </b> {X.join(" | ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}> Y : </b> {Y.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="\bm {X_{target}} " />:{" "}
          </b>{" "}
          {X_target.join(" , ")}
        </p>
        <span>
          <b style={{ fontSize: 22, paddingLeft: "5%" }}>
            <TeX math="\bm {Vector_{B}} " />:{" "}
          </b>
        </span>
        <span>
          <b style={{ fontSize: 22, paddingLeft: "35%" }}>
            <TeX math="\bm {Vector_{X}} " />:{" "}
          </b>{" "}
        </span>
        <p style={{ textIndent: "10rem" }}>
          {VecB_dep} = {Vec_B}
          &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;
          &emsp; &emsp;
          {VecX_dep} = {Vec_X}
        </p>
        <br />
        <span>
          <b style={{ fontSize: 22, paddingLeft: "5%" }}>Matrix A :</b>
        </span>
        <p style={{ textIndent: "5rem" }}>
          {MatA_dep} = {Mat_A}
        </p>
        <span>
          <b style={{ fontSize: 22, paddingLeft: "5%" }}>Inverse Matrix A :</b>{" "}
        </span>
        <p style={{ textIndent: "5rem"}}>
          {Mat_A_in_dep} = {Mat_A_in}
        </p>
        <br />
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Multiple Linear Regression </h1>
      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล X (เป็นอาเรย์)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่า X อาเรย์"
          aria-describedby="texthelp1"
          onChange={inputAX}
          value={arr_X}
        />
        <Form.Text
          id="texthelp1"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
        </Form.Text>
      </Form.Group>

      <br/>

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล <TeX math="X_{2}" /> (เป็นอาเรย์)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่า X อาเรย์"
          aria-describedby="texthelp1"
          onChange={inputAX2}
          value={arr_X2}
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
          ค่าข้อมูล <TeX math="X_{3}" /> (เป็นอาเรย์)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่า X อาเรย์"
          aria-describedby="texthelp1"
          onChange={inputAX3}
          value={arr_X3}
        />
        <Form.Text
          id="texthelp5"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
        </Form.Text>
      </Form.Group>

      <br />

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล Y (เป็นอาเรย์)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่า Y อาเรย์"
          aria-describedby="texthelp2"
          onChange={inputAY}
          value={arr_Y}
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
          ค่า <TeX math="X_{target}" /> (จำนวน 3 ตัว)
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ค่า X ที่ต้องการหา"
          aria-describedby="texthelp3"
          onChange={inputXF}
          value={X_find}
        />
        <Form.Text
          id="texthelp3"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
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
      <div className="graph">
        <div id="myChart"></div>
      </div>
      {answer}
    </Form>
  );
};

export default MeL_R;

/*

ตัวที่     x1       x2      x3      Y
-------------------------------------
1       1         0       1      4     x0          
2       0         1       3     -5     x1
3       2         4       1     -6     x2
4       3         2       2      0     x3
5       4         1       5     -1     x4
6       2         3       3     -7     x5
7       1         6       4    -20     x6
-------------------------------------

const X = [1,0,2,3,4,2,1];
const X2 = [0,1,4,2,1,3,6];
const X3 = [1,3,1,2,5,3,4];

const Y = [4,-5,-6,0,-1,-7,-20];

const X_T = transpose(X);
console.table(X_T);
MULTIPLE_LINEAR_REGRESSION(X_T, Y);

*/
