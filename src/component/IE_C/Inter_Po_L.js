import "./ie_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import axios from "axios";

// Lagrange Interpolation

const Inter_Po_L = () => {
  const [arr_X, setAX] = useState(["0"]);
  const [arr_Y, setAY] = useState(["0"]);
  const [X_find, setXF] = useState(0);

  const [output, setOut] = useState(null);

  const [TableC, setTableC] = useState(null);
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
    IP_M();
    setAX(["0"]);
    setAY(["0"]);
    setXF(0);
  };

  function callAPI() {
    const headers = {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
    };
    axios
      .get("http://localhost:4000/api/Interpolation", { headers })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id === "Lagrange") {
            setAX(response.data.result[i].arr_X);
            setAY(response.data.result[i].arr_Y);
            setXF(response.data.result[i].X_find);
          }
        }
      });
  }

  const IP_M = () => {
    let x_arr = arr_X.map((x) => Number(x)),
      y = arr_Y.map((Y) => parseFloat(Y));
    let X = Number(X_find);

    let n = x_arr.length; //* ความยาวของจำนวนตัวแปรที่มี x0 ถึว xn
    var L_array = new Array(n).fill(1); //* สร้าง array 1 มิติ

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i != j) {
          L_array[i] *= (x_arr[j] - X) / (x_arr[j] - x_arr[i]);
        }
      }
    }

    //? Lagrange

    let m = y.length;
    var L_fx_arr = new Array(m);
    var ans = 0;

    for (let i = 0; i < m; i++) {
      L_fx_arr[i] = L_array[i] * y[i];
      ans += L_fx_arr[i];
    }

    const columns = [
      {
        field: "L_index",
        headerName: "L ตัวที่",
        headerClassName: "super-app-theme--header",
        headerAlign: "left",
        type: "string",
        width: 130,
      },
      {
        field: "value",
        headerName: "ค่าข้อมูล L",
        headerClassName: "super-app-theme--header",
        width: 200,
        type: "number",
        flex: 1,
      },
      {
        field: "valueFX",
        headerName: "ค่า L * F(x)",
        headerClassName: "super-app-theme--header",
        width: 200,
        type: "number",
        flex: 1,
      },
    ];
    const rows = [];

    for (let i = 0; i < L_array.length; i++) {
      rows.push({
        internalId: uuid(),
        L_index: i.toString(),
        value: L_array[i],
        valueFX: L_fx_arr[i],
      });
    }

    setTableC(
      <Box
        sx={{
          ".MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
          },
          ".MuiDataGrid-cell": {
            backgroundColor: "#fafafa",
            textAlign: "start",
          },
          "& .super-app-theme--header": {
            backgroundColor: "#000000",
            color: "#ffffff",
          },
          "& .MuiDataGrid-cell:hover": {
            backgroundColor: "#eeeeee",
            color: "primary.main",
          },
          ".MuiDataGrid-footerContainer": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          style={{ height: 450, Background: "white" }}
          columns={columns}
          rows={rows}
          getRowId={(rows) => rows.internalId}
        />
      </Box>
    );

    var trace1 = {
      // data สำหรับ plot กราฟ
      x: x_arr,
      y: y,
      mode: "lines+markers",
      type: "scatter",
      hovertemplate: "<i><b>X</b></i>: %{x:.8f}" + "<br><b>Y</b>: %{y:.8f}<br>",
      name: "Input X , Y",
    };

    var trace2 = {
      x: [X], //X_find
      y: [ans],
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
        text: "Interpolation Graph (Lagrange)",
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
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <TeX math="Y_{ans} = " /> <b>{ans}</b>{" "}
      </p>
    );

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}> X : </b> {x_arr.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}> Y : </b> {y.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="X_{target} " />:{" "}
          </b>{" "}
          {X}
        </p>
        <br />
        <h2> L Table </h2>
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Interpolation (Lagrange) </h1>
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
          ค่า <TeX math="X_{target}"/> (สำหรับหา <TeX math="Y_{target} " />)
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

      <div>
        <Button variant="primary" size="lg" onClick={callAPI} className="btn">
          {" "}
          ตัวอย่าง{" "}
        </Button>{" "}
      </div>
      <br />

      <div id="myout">{output}</div>
      <div id="myTable" style={{ height: "100%" }}>
        {TableC}
      </div>
      <div className="graph">
        <div id="myChart"></div>
      </div>
      {answer}
    </Form>
  );
};

export default Inter_Po_L;

/*

      x   | y=f(x) | Index ที่ |  จุดที่ 
    ------------------------------------
     -100 | 215    |    0    |    1
      0   | 202    |    1    |    2
     100  | 206    |    2    |    3
     200  | 215    |    3    |    4
     300  | 228    |    4    |    5
     400  | 249    |    5    |    6

const X = 250;

//ข้อ 1.1
let x_arr_1 = [-100, 400]; //(2 จุด : จุด 1 กับ จุด 6)
let y_arr_1 = [215, 249];

//ข้อ 1.2
let x_arr_2 = [-100, 100, 400]; //(3 จุด : จุด 1 , จุด 3 กับ จุด 6)
let y_arr_2 = [215, 206, 249];

//ข้อ 1.3
let x_arr_3 = [-100, 0, 100, 200, 300, 400]; //(6 จุด : ทุกจุด)
let y_arr_3 = [215, 202, 206, 215, 228, 249];
*/

/* 
      x   | y=f(x) | Index ที่ |  จุดที่ 
    ------------------------------------
     -100 | 215    |    0    |    1
      0   | 202    |    1    |    2
     100  | 206    |    2    |    3
     200  | 215    |    3    |    4
     300  | 228    |    4    |    5
     400  | 249    |    5    |    6

*/

/*

var arr_1 = Interpor_2(x_arr_1, X);
var answer_1 = Lagrange(arr_1, y_arr_1);
console.log("answer 1 = " + answer_1.toFixed(6));

var arr_2 = Interpor_2(x_arr_2, X);
var answer_2 = Lagrange(arr_2, y_arr_2);
console.log("answer 2 = " + answer_2.toFixed(6));

var arr_3 = Interpor_2(x_arr_3, X);
var answer_3 = Lagrange(arr_3, y_arr_3);
console.log("answer 3 = " + answer_3.toFixed(6));
*/
