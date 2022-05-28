import "./bsc.css";
import { Form, Button } from "react-bootstrap";
import { compile as cp, exp } from "mathjs";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";
import axios from "axios";

const Scant = () => {
  const [val_Xi_0, setXi_0] = useState(0);
  const [val_Xi_1, setXi_1] = useState(0);
  const [fun, setFun] = useState("");
  const [table, setTable] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputXi_0 = (event) => {
    setXi_0(event.target.value);
  };

  const inputXi_1 = (event) => {
    setXi_1(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    S_M();
    setXi_0(0);
    setXi_1(0);
    setFun("");
  };

  function callAPI() {
    const headers = {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
    };
    axios
      .get("http://localhost:4000/api/rootofequation", { headers })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id === "Scant") {
            setXi_0(response.data.result[i].val_Xi_0);
            setXi_1(response.data.result[i].val_Xi_1);
            setFun(response.data.result[i].fun);
          }
        }
      });
  }

  const S_M = () => {
    //! (1 / sqrt(7)) * x - 2 + (x * x) / 7.0
    //? Xi_0 = 2.0, Xi_1 = 3.0

    function fx(fsx, X) {
      var math = cp(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    let num = 1;
    let x1 = Number(val_Xi_0),
      x2 = Number(val_Xi_1);
    var funct = fun;
    let dataTable = [];
    let X = [];
    let Y = [];

    let xnew_2, xnew_1;

    do {
      xnew_1 =
        (x1 * fx(funct, x2) - x2 * fx(funct, x1)) /
        (fx(funct, x2) - fx(funct, x1));

      x1 = x2;
      x2 = xnew_1;

      xnew_2 =
        (x1 * fx(funct, x2) - x2 * fx(funct, x1)) /
        (fx(funct, x2) - fx(funct, x1));

      num = Math.abs((xnew_2 - xnew_1) / xnew_2);

      dataTable.push({
        xi_0: x1.toFixed(8),
        xi_1: x2.toFixed(8),
        Xnew_1: xnew_1.toFixed(8),
        Xnew_2: xnew_2.toFixed(8),
        Err: num.toFixed(8),
      });
      X.push(xnew_1.toFixed(8)); //X สำหรับกราฟแกน X
      Y.push(num.toFixed(8)); //Y สำหรับกราฟแกน Y
    } while (num >= 0.000001);

    //console.log("answer = " + xnew_1.toFixed(6));

    const columns = [
      {
        field: "round",
        headerName: "Round",
        headerClassName: "super-app-theme--header",
        headerAlign: "left",
        type: "number",
        width: 130,
      },
      {
        field: "xi0",
        headerName: "Xi ที่ 0",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "xi1",
        headerName: "Xi ที่ 1",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "Xnew1",
        headerName: "Xใหม่ ตัวที่ 1",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "Xnew2",
        headerName: "Xใหม่ ตัวที่ 2",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "eR",
        headerName: "ERROR",
        headerClassName: "super-app-theme--header",
        width: 200,
      },
    ];
    const rows = [];
    let R = [];
    for (let i = 0; i < dataTable.length; i++) {
      rows.push({
        internalId: uuid(),
        round: i + 1,
        xi0: dataTable[i].xi_0,
        xi1: dataTable[i].xi_1,
        Xnew1: dataTable[i].Xnew_1,
        Xnew2: dataTable[i].Xnew_2,
        eR: dataTable[i].Err,
      });
      R.push(i + 1);
    }

    setTable(
      <Box
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          ".MuiDataGrid-columnHeaders": {
            backgroundColor: "#ffffff",
          },
		  ".MuiDataGrid-virtualScrollerContent":{
			backgroundColor: "#ffffff",
		  },
          ".MuiDataGrid-cell": {
            backgroundColor: "#fafafa",
          },
          "& .super-app-theme--header": {
            backgroundColor: "#ffffff",
          },
          "& .MuiDataGrid-cell:hover": {
            backgroundColor: "#eeeeee",
            color: "primary.main",
          },
          ".MuiDataGrid-footerContainer": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DataGrid
          style={{ height: 500 }}
          columns={columns}
          rows={rows}
          getRowId={(rows) => rows.internalId}
        />
      </Box>
    );

    var data = {
      // data สำหรับ plot กราฟ
      x: X, //ค่า XM
      y: Y, //ค่า Error
      text: R, //ค่า Round
      type: "scatter",
      hovertemplate:
        "<i><b>X</b></i>: %{x:.8f}" +
        "<br><b>Error</b>: %{y:.8f}<br>" +
        "<b>Round: %{text}</b>",
    };
    var layout = {
      title: {
        text: "ตารางเปรียบเทียบค่า X ที่ได้ และ Error",
        font: {
          family: "FCRoundBold",
          size: 24,
        },
      },
      xaxis: {
        title: {
          text: "ค่า X ที่คำนวณได้",
          font: {
            family: "FCRoundRegular",
            size: 18,
            color: "#7f7f7f",
          },
        },
        autorange: true,
        tickformat: ".2f",
        showlegend: false,
      },
      yaxis: {
        title: {
          text: "ค่า Error ความคลาดเคลื่อน",
          font: {
            family: "FCRoundRegular",
            size: 18,
            color: "#7f7f7f",
          },
        },
        autorange: true,
        tickformat: ".2f",
        showlegend: false,
      },
    };

    setGraph(Plotly.newPlot("myChart", [data], layout));
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h2 className="fontFCBold">Scant Method</h2>
      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล Xi ที่ 0
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่า Xi ที่ 0"
          aria-describedby="texthelp1"
          onChange={inputXi_0}
          value={val_Xi_0}
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
          ค่าข้อมูล Xi ที่ 1
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่าXi ตัวที่ 1"
          aria-describedby="texthelp2"
          onChange={inputXi_1}
          value={val_Xi_1}
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
          ฟังก์ชัน
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ระบุฟังก์ชันที่ต้องการคำนวณ"
          aria-describedby="texthelp3"
          onChange={inputFun}
          value={fun}
        />
        <Form.Text
          id="texthelp3"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ฟังก์ชันต้องอยู่ในรูปแบบฟังก์ชันคอมพิวเตอร์
          (ไม่สามารถคำนวณด้วยฟังก์ชันที่เขียนทั่วไปได้)
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
      <div id="myTable" style={{ height: "100%" }}>
        {table}
      </div>

      <div className="graph">
        <br />
        <div id="myChart"></div>
        <br />
        <br />
      </div>
    </Form>
  );
};

export default Scant;
