import "./ie_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import Plotly from "plotly.js-dist";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";

// Spline Linear

const Spline_Li = () => {
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
    temp = temp.toString().split(",");
    setXF(temp);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    SP_M();
    setAX(["0"]);
    setAY(["0"]);
    setXF(0);
  };

  const SP_M = () => {
    let x_arr = arr_X.map((x) => Number(x)),
      y_arr = arr_Y.map((Y) => parseFloat(Y));
    let X = Number(X_find);
    var F = 0,
      M = 0;

    var M_Slope = (x_arr, fx, j) => {
      var M = 0;
      M = (fx[j] - fx[j - 1]) / (x_arr[j] - x_arr[j - 1]);
      return M;
    };

    for (let i = 0, j = 1; i < x_arr.length; i++) {
      if (X > x_arr[i] && X < x_arr[j]) {
        M = M_Slope(x_arr, y_arr, j);
        F = y_arr[i] + M * (X - x_arr[i]);
      }
      j++;
    }
    var trace1 = {
      // data สำหรับ plot กราฟ
      x: x_arr,
      y: y_arr,
      mode: "lines+markers",
      type: "scatter",
      hovertemplate: "<i><b>X</b></i>: %{x:.8f}" + "<br><b>Y</b>: %{y:.8f}<br>",
      name: "Input X , Y",
    };

    var trace2 = {
      x: [X], //X_find
      y: [F],
      mode: "markers",
      type: "scatter",
      hovertemplate:
        "<i><b>X Target = </b></i>: %{x:.8f}<br>" +
        "<i><b>Y Target = </b></i>: %{y:.8f}",
      name: "Answer",
      marker: {
        color: "rgb(220,20,60)",
        size: 10,
      },
    };

    var data = [trace1, trace2];

    var layout = {
      title: {
        text: "Spline Interpolation Graph (Linear)",
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

    setAnswer(
      <p className="AnswerStyle">
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <TeX math="Y_{target} = " /> <b>{F}</b>{" "}
      </p>
    );

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}> X : </b> {x_arr.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}> Y : </b> {y_arr.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="X_{target} " />:{" "}
          </b>{" "}
          {X}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="M_{Slope} " />:{" "}
          </b>{" "}
          {M}
        </p>
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Spline (Linear) </h1>
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
          ค่า <TeX math="X_{target}" /> (สำหรับหา <TeX math="Y_{target} " />)
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
export default Spline_Li;

/*


จุดที่     x        y
------------------------
1       2        9.5
2       4        8.0
3       6        10.5
4       8        39.5
5       10       72.5
------------------------

const Ans_X = 7;

let x_arr_1 = [2, 4, 6, 8, 10];
let y_arr_1 = [9.5, 8.0, 10.5, 39.5, 72.5];

console.log(
  "X = " + Ans_X + " , f(X) = " + Interpor_3(x_arr_1, y_arr_1, Ans_X)
);

*/
