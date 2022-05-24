import "./lsr_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import Plotly from "plotly.js-dist";
import TeX from "@matejmazur/react-katex";
import { multiply, inv } from "mathjs";

//POLYNOMIAL REGRESSION

const Po_R = () => {

  const [arr_X, setAX] = useState(["0"]);
  const [arr_Y, setAY] = useState(["0"]);
  const [X_find, setXF] = useState(0);

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputAX = (event) => {
    var temp = String(event.target.value);
    temp = temp.toString().split(" ");
    temp = temp.toString().split(",");
    setAX(temp);
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
    setXF(temp);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    POLYNOMIAL_REGRESSION();
    setAX(["0"]);
    setAY(["0"]);
    setXF(0);
  };

  const POLYNOMIAL_REGRESSION = () => {
    function another_Sum(x_arr, power) {
      var temp = 0;
      for (let i = 0; i < x_arr.length; i++) {
        temp += Math.pow(x_arr[i], power);
      }
      return temp;
    }

    function another_Sum_Y(x_arr, y_arr, power) {
      var temp = 0;
      for (let i = 0; i < x_arr.length; i++) {
        temp += Math.pow(x_arr[i], power) * y_arr[i];
      }
      return temp;
    }

    let X = arr_X.map((x) => Number(x)),
      Y = arr_Y.map((Y) => parseFloat(Y));
    let x_target = Number(X_find);
    let m = 2;

    var n = X.length;
    var A = new Array(m + 1);
    var B = new Array(m + 1);

    for (let i = 0; i < m + 1; i++) {
      A[i] = new Array(m + 1);
      if (i == 0) {
        A[i][0] = n;
        for (let j = 1; j < m + 1; j++) {
          A[i][j] = another_Sum(X, j + i);
        }
      } else {
        for (let j = 0; j < m + 1; j++) {
          A[i][j] = another_Sum(X, j + i);
        }
      }
      B[i] = another_Sum_Y(X, Y, i);
    }
    var A_I = inv(A);
    var a = multiply(A_I, B);
    for (let i = 0; i < a.length; i++) {
      a[i] = Number(a[i].toFixed(4));
    }
    var gx = a[0];
    for (let i = 1; i < m + 1; i++) {
      gx += a[i] * Math.pow(x_target, i);
    }

    setAnswer(
      <p className="AnswerStyle">
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <TeX math="Y_{target} = " />{" "}
        <b>{gx.toFixed(6)}</b>{" "}
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
      x: [x_target], //X_find
      y: [gx],
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
        text: "Polynomial Regression",
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

    const MatA_dep = (
      <TeX
        math="A = \begin{Bmatrix} 
        n & \sum_{\substack{i=1}}^{n} X_{i} & \sum_{\substack{i=1}}^{n} X^{2}_{i} \\
        \sum_{\substack{i=1}}^{n} X_{i} & \sum_{\substack{i=1}}^{n} X^{2}_{i} & \sum_{\substack{i=1}}^{n} X^{3}_{i} \\
        \sum_{\substack{i=1}}^{n} X^{2}_{i} & \sum_{\substack{i=1}}^{n} X^{3}_{i} & \sum_{\substack{i=1}}^{n} X^{4}_{i} \\
        \end{Bmatrix}"
      />
    );

    const VecX_dep = (
      <TeX
        math="\begin{Bmatrix} 
          a_{0} \\ a_{1} \\ a_{2}
          \end{Bmatrix}"
      />
    );

    const Mat_A_in_dep = <TeX math="A^{-1}" />;

    var arr = [];
    for (let index = 0; index < a.length; index++) {
      arr.push(<li>{String(a[index].toFixed(6))}</li>);
    }

    const Vec_X = <ul className="bitem">{arr}</ul>;

    var arr2 = [];
    var s_num = [];
    for (let index = 0; index < A.length; index++) {
      for (let j = 0; j < A[0].length; j++) {
        s_num.push(String(A[index][j]));
      }
      arr2.push(<li>{s_num.join(" , ")}</li>);
      s_num.length = 0;
    }

    const Mat_A = <ul className="bitem">{arr2}</ul>;

    var arr3 = [];
    var s_num2 = [];
    for (let index = 0; index < A_I.length; index++) {
      for (let j = 0; j < A_I[0].length; j++) {
        s_num2.push(String(A_I[index][j].toFixed(6)));
      }
      arr3.push(<li>{s_num2.join(" , ")}</li>);
      s_num2.length = 0;
    }

    const Mat_A_in = <ul className="bitem">{arr3}</ul>;

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}> X : </b> {X.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            {" "}
            Y (<TeX math="\bm {Vector_{B}}" />) :{" "}
          </b>{" "}
          {Y.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="\bm {X_{target}} " />:{" "}
          </b>{" "}
          {x_target}
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
        <p style={{ textIndent: "5rem" }}>
          {Mat_A_in_dep} = {Mat_A_in}
        </p>
        <br />
        <span>
          <b style={{ fontSize: 22, paddingLeft: "5%", paddingTop: "2%" }}>
            Vector X :{" "}
          </b>{" "}
        </span>
        <p style={{ textIndent: "10rem" }}>
          {VecX_dep} = {Vec_X}
        </p>
        <br />
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Polynomial Regression </h1>
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
          ค่า X ที่ต้องการหา
        </Form.Label>
        <Form.Control
          type="number"
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

      <div id="myout">{output}</div>
      <div className="graph">
        <div id="myChart"></div>
      </div>
      {answer}
    </Form>
  );
};

export default Po_R;

/*

ตัวที่     x        y = f(x)
------------------------
1       10       5        x0          
2       15       9        x1
3       20       15       x2
4       30       18       x3
5       40       22       x4
6       50       30       x5
7       60       35       x6
8       70       38       x7
9       80       43       x8
------------------------

const x_array = [10,15,20,30,40,50,60,70,80];
const y_array = [5,9,15,18,22,30,35,38,43];
const m = 2;

*/
