import "./ie_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import Plotly from "plotly.js-dist";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import "katex/dist/katex.min.css";
import TeX from "@matejmazur/react-katex";
import { inv, multiply, reshape } from "mathjs";
import axios from "axios";

// Cubic Spline

const Spline_Cu = () => {
  const [arr_X, setAX] = useState(["0"]);
  const [arr_Y, setAY] = useState(["0"]);
  const [X_find, setXF] = useState(0);
  const [check, setCheck] = useState(false);

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [Table_A, setTableA] = useState(null);
  const [Table_A_in, setTableA_in] = useState(null);
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
    CS_M();
    setCheck(true);
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
          if (response.data.result[i].id === "SplineCubic") {
            setAX(response.data.result[i].arr_X);
            setAY(response.data.result[i].arr_Y);
            setXF(response.data.result[i].X_find);
          }
        }
      });
  }

  const CS_M = () => {
    let X = arr_X.map((x_arr) => Number(x_arr)),
      Y = arr_Y.map((y_arr) => parseFloat(y_arr));
    let X_tar = Number(X_find);

    var amount_x = X.length; // 5
    var amount_f = amount_x - 1; // f1 , f2 , f3 , ... , fn
    var m = amount_f * 4; //16
    var A_proto = new Array(m).fill(0); //row
    var x_t = X.slice(1);

    var j = 0;

    for (let i = 0, k = 0; i < m; i = i + 4) {
      if (i == 0) {
        A_proto[j] = new Array(m).fill(0);

        A_proto[j][i] = Math.pow(x_t[k], 3);
        A_proto[j][i + 1] = Math.pow(x_t[k], 2);
        A_proto[j][i + 2] = x_t[k];
        A_proto[j][i + 3] = 1;

        j++;
        k++;
        continue;
      } else if (i == m - 4) {
        A_proto[j] = new Array(m).fill(0);
        A_proto[j][i] = Math.pow(x_t[k - 1], 3);
        A_proto[j][i + 1] = Math.pow(x_t[k - 1], 2);
        A_proto[j][i + 2] = x_t[k - 1];
        A_proto[j][i + 3] = 1;

        A_proto[++j] = new Array(m).fill(0);
        A_proto[j][0] = Math.pow(X[0], 3);
        A_proto[j][1] = Math.pow(X[0], 2);
        A_proto[j][2] = X[0];
        A_proto[j][3] = 1;

        A_proto[++j] = new Array(m).fill(0);
        A_proto[j][i] = Math.pow(X[amount_f], 3);
        A_proto[j][i + 1] = Math.pow(X[amount_f], 2);
        A_proto[j][i + 2] = X[amount_f];
        A_proto[j][i + 3] = 1;

        j++;
        k++;

        break;
      } else {
        A_proto[j] = new Array(m).fill(0);
        A_proto[j][i] = Math.pow(x_t[k - 1], 3);
        A_proto[j][i + 1] = Math.pow(x_t[k - 1], 2);
        A_proto[j][i + 2] = x_t[k - 1];
        A_proto[j][i + 3] = 1;

        A_proto[++j] = new Array(m).fill(0);
        A_proto[j][i] = Math.pow(x_t[k], 3);
        A_proto[j][i + 1] = Math.pow(x_t[k], 2);
        A_proto[j][i + 2] = x_t[k];
        A_proto[j][i + 3] = 1;

        j++;
        k++;
      }
    }

    for (let i = 0, l = 0; i < m - 4; i = i + 4) {
      A_proto[j] = new Array(m).fill(0);

      A_proto[j][i] = 3 * Math.pow(x_t[l], 2);
      A_proto[j][i + 1] = 2 * x_t[l];
      A_proto[j][i + 2] = 1;

      A_proto[j][i + 4] = -3 * Math.pow(x_t[l], 2);
      A_proto[j][i + 5] = -2 * x_t[l];
      A_proto[j][i + 6] = -1;

      l++;
      j++;
    }

    let i = 0;
    for (let l = 0; i < m - 4; i = i + 4) {
      A_proto[j] = new Array(m).fill(0);

      A_proto[j][i] = 6 * x_t[l];
      A_proto[j][i + 1] = 2;

      A_proto[j][i + 4] = -6 * x_t[l];
      A_proto[j][i + 5] = -2;

      l++;
      j++;
    }

    A_proto[j] = new Array(m).fill(0);
    A_proto[j][0] = 6 * X[0];
    A_proto[j][1] = 2;

    A_proto[++j] = new Array(m).fill(0);
    A_proto[j][i] = -6 * X[amount_f - 1];
    A_proto[j][i + 1] = -2;

    var A_M = reshape(A_proto, [m, m]);
    var A_I = inv(A_M);

    for (let i = 0; i < A_I.length; i++) {
      for (let j = 0; j < A_I[0].length; j++) {
        A_I[i][j] = Number(A_I[i][j].toFixed(2));
      }
    }

    var b_cal = new Array(m).fill(0);

    for (let i = 0, j = 1; j < Y.length; j++) {
      if (j == Y.length - 1) {
        b_cal[i] = Y[0];
        b_cal[i + 1] = Y[j];
        break;
      }
      b_cal[i] = Y[j];
      b_cal[i + 1] = Y[j];
      i = i + 2;
    }
    var x_cal = multiply(A_I, b_cal);
    for (let i = 0; i < x_cal.length; i++) {
      x_cal[i] = Number(x_cal[i].toFixed(4));
    }

    var answer = 0;
    for (let i = 0, j = 1, k = 0; i < X.length; i++) {
      if (X_tar > X[i] && X_tar < X[j]) {
        answer =
          x_cal[k] * Math.pow(X_tar, 3) +
          x_cal[k + 1] * Math.pow(X_tar, 2) +
          (x_cal[k + 2] * X_tar, 2) +
          x_cal[k + 3];
      }
      j++;
      k = k + 4;
    }

    setAnswer(
      <p className="AnswerStyle">
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <TeX math="Y_{target} = " />{" "}
        <b>{answer}</b>{" "}
      </p>
    );

    const VecB_dep = (
      <TeX
        math="\begin{Bmatrix}
        f_1(x_1) \\ f_2(x_1) \\ f_2(x_2) \\ f_3(x_2) \\ f_3(x_3)\\ f_4(x_3) \\ f_1(x_0) \\ f_4(x_4) \\ 0 \\ 0 \\ 0  \\ 0 \\ 0 \\ 0  \\ 0 \\ 0 \end{Bmatrix}"
      />
    );

    const VecX_dep = (
      <TeX math="\begin{Bmatrix} a_1 \\ b_1 \\ c_1 \\ d_1 \\ a_2 \\ b_2 \\ c_2 \\ d_2 \\ a_3 \\ b_3 \\ c_3 \\ d_3 \\ a_4 \\ b_4 \\ c_4 \\ d_4 \end{Bmatrix}" />
    );

    var arr = [];
    for (let index = 0; index < b_cal.length; index++) {
      arr.push(<li>{String(b_cal[index])}</li>);
    }

    const Vec_B = <ul className="bitem">{arr}</ul>;

    var arr2 = [];
    for (let index = 0; index < x_cal.length; index++) {
      arr2.push(<li>{String(x_cal[index])}</li>);
    }

    const Vec_X = <ul className="bitem">{arr2}</ul>;

    const columns = [
      {
        field: "index",
        headerName: "ลำดับที่",
        headerClassName: "super-app-theme--header",
        headerAlign: "left",
        type: "string",
        width: 100,
      },
      {
        field: "A1",
        headerName: "a1",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "B1",
        headerName: "b1",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "C1",
        headerName: "c1",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "D1",
        headerName: "d1",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "A2",
        headerName: "a2",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "B2",
        headerName: "b2",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "C2",
        headerName: "c2",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "D2",
        headerName: "d2",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "A3",
        headerName: "a3",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "B3",
        headerName: "b3",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "C3",
        headerName: "c3",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "D3",
        headerName: "d3",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "A4",
        headerName: "a4",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "B4",
        headerName: "b4",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "C4",
        headerName: "c4",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
      {
        field: "D4",
        headerName: "d4",
        headerClassName: "super-app-theme--header",
        type: "string",
        width: 100,
      },
    ];
    const rows = [];

    for (let i = 0; i < A_proto.length; i++) {
      rows.push({
        internalId: uuid(),
        index: (i + 1).toString(),
        A1: A_proto[i][0],
        B1: A_proto[i][1],
        C1: A_proto[i][2],
        D1: A_proto[i][3],
        A2: A_proto[i][4],
        B2: A_proto[i][5],
        C2: A_proto[i][6],
        D2: A_proto[i][7],
        A3: A_proto[i][8],
        B3: A_proto[i][9],
        C3: A_proto[i][10],
        D3: A_proto[i][11],
        A4: A_proto[i][12],
        B4: A_proto[i][13],
        C4: A_proto[i][14],
        D4: A_proto[i][15],
      });
    }

    setTableA(
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
          "& .MuiDataGrid-footerContainer": {
            background: "#ffffff",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          style={{ height: 545, Background: "white" }}
          pageSize={8}
          pagination
          columns={columns}
          rows={rows}
          getRowId={(rows) => rows.internalId}
        />
      </Box>
    );

    const rows2 = [];

    for (let i = 0; i < A_I.length; i++) {
      rows2.push({
        internalId: uuid(),
        index: (i + 1).toString(),
        A1: A_I[i][0],
        B1: A_I[i][1],
        C1: A_I[i][2],
        D1: A_I[i][3],
        A2: A_I[i][4],
        B2: A_I[i][5],
        C2: A_I[i][6],
        D2: A_I[i][7],
        A3: A_I[i][8],
        B3: A_I[i][9],
        C3: A_I[i][10],
        D3: A_I[i][11],
        A4: A_I[i][12],
        B4: A_I[i][13],
        C4: A_I[i][14],
        D4: A_I[i][15],
      });
    }

    setTableA_in(
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
          "& .MuiDataGrid-footerContainer": {
            background: "#ffffff",
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          style={{ height: 545, Background: "white" }}
          pageSize={8}
          pagination
          columns={columns}
          rows={rows2}
          getRowId={(rows) => rows.internalId}
        />
      </Box>
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
      x: [X_tar], //X_find
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
        text: "Spline interpolation (Cubic)",
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

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}> X : </b> {X.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}> Y : </b> {Y.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>
            <TeX math="X_{target} " />:{" "}
          </b>{" "}
          {X_tar}
        </p>
        <span>
          <b style={{ fontSize: 22, paddingLeft: "5%" }}>
            <TeX math="Vector_{B} " />:{" "}
          </b>
        </span>
        <span>
          <b style={{ fontSize: 22, paddingLeft: "35%" }}>
            <TeX math="Vector_{X} " />:{" "}
          </b>{" "}
        </span>
        <p style={{ textIndent: "10rem" }}>
          {VecB_dep} = {Vec_B}
          &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp; &emsp;
          &emsp; &emsp;
          {VecX_dep} = {Vec_X}
        </p>
        <br />
        <h2> A Table </h2>
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Spline (Cubic) </h1>
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

      <div>
        <Button variant="primary" size="lg" onClick={callAPI} className="btn">
          {" "}
          ตัวอย่าง{" "}
        </Button>{" "}
      </div>
      <br />

      <div id="myout">{output}</div>
      <div id="mytable">{Table_A}</div>
      {check && (
        <h2 id=" h2_1" className="myh2">
          {" "}
          A Invert Table
        </h2>
      )}
      <div id="mytable2">{Table_A_in}</div>
      <div className="graph">
        <div id="myChart"></div>
      </div>
      
      {answer}
    </Form>
  );
};

export default Spline_Cu;

/*

จุดที่     x        y
------------------------
1       2        9.5        x0
2       4        8.0        x1
3       6        10.5       x2
4       8        39.5       x3
5       10       72.5       x4
------------------------

const X = [2 , 4 , 6 , 8 , 10];
const Y = [9.5 , 8.0 , 10.5 , 39.5 , 72.5];
const X_find = 7;

*/
