import "./bsc.css";
import { Form, Button } from "react-bootstrap";
import { compile as cp } from "mathjs";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";
import axios from "axios";

// intital = 2.0;

const NR = () => {
  const [val_X0, setX0] = useState(0);
  const [dfun, setDfun] = useState("");
  const [fun, setFun] = useState("");
  const [table, setTable] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputX0 = (event) => {
    setX0(event.target.value);
  };

  const inputDfun = (event) => {
    setDfun(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    NR_M();
    setX0(0);
    setDfun("");
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
          if (response.data.result[i].id === "Newton") {
            setX0(response.data.result[i].val_X0);
            setDfun(response.data.result[i].dfun);
            setFun(response.data.result[i].fun);
          }
        }
      });
  }


  const NR_M = () => {
    function fx(fsx, X) {
      var math = cp(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

      //! (1 / sqrt(7)) * x - 2 + (x * x) / 7.0
      //! 1 / sqrt(7) + (1 / 7.0) * (2 * x)
    /*
  var f_x0 = (x) => {
    return (1 / Math.sqrt(7)) * x - 2 + (x * x) / 7.0;
  };

  var df_x0 = (x) => {
    return 1 / Math.sqrt(7) + (1 / 7.0) * (2 * x);
  };*/

    var X0 = Number(val_X0);
    var funct = fun;
    var dfunct = dfun;
    var X1 = 0;
    var num = 0;
    let dataTable = [];
    let X = [];
    let Y = [];

    do {
      //x1 = x0 - f_x0(x0) / df_x0(x0);
      X1 = X0 - fx(funct, X0) / fx(dfunct, X0);
      num = Math.abs((X1 - X0) / X1);

      dataTable.push({
        x0: X0.toFixed(8),
        x1: X1.toFixed(8),
        Err: num.toFixed(8),
      });
      X.push(X0.toFixed(8)); //X สำหรับกราฟแกน X
      Y.push(num.toFixed(8)); //Y สำหรับกราฟแกน Y

      X0 = X1;
    } while (num > 0.000001);

    console.log("ans = " + X0.toFixed(6));

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
        field: "x0",
        headerName: "X0",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "x1",
        headerName: "X1",
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
        x0: dataTable[i].x0,
        x1: dataTable[i].x1,
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
      x: X, //ค่า X0
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
      <h2 className="fontFCBold">Newton-Raphson Method</h2>
      {/*
      <dd>
        <p style={{ textAlign: "justify" }}>
          เป็นวิธีการที่ดัดแปลงมาจาก 'Binary Search
          (การหาข้อมูลโดยแบ่งครึ่งจำนวนข้อมูลทั้งหมดไปเรื่อยๆ)'
          โดยมีเงื่อนไขในการใช้ methodo นี้อยู่อย่างหนึ่ง นั่นก็คือ...
        </p>
        <p style={{ textAlign: "left", color: "red" }}>
          {" "}
          ค่า x ที่ใช้ต้องมีการเรียงลำดับมาแล้ว
        </p>
      </dd>*/}
      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล X0
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่า X0"
          aria-describedby="texthelp1"
          onChange={inputX0}
          value={val_X0}
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
          ฟังก์ชันปกติ
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ระบุฟังก์ชันที่ต้องการคำนวณ"
          aria-describedby="texthelp2"
          onChange={inputFun}
          value={fun}
        />
        <Form.Text
          id="texthelp2"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ฟังก์ชันต้องอยู่ในรูปแบบฟังก์ชันคอมพิวเตอร์
          (ไม่สามารถคำนวณด้วยฟังก์ชันที่เขียนทั่วไปได้)
        </Form.Text>
      </Form.Group>

      <br />

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ฟังก์ชัน Diff
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ระบุฟังก์ชันdiffของฟังก์ชันปกติก่อนหน้านี้"
          aria-describedby="texthelp3"
          onChange={inputDfun}
          value={dfun}
        />
        <Form.Text
          id="texthelp3"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ฟังก์ชันต้องอยู่ในรูปแบบฟังก์ชันคอมพิวเตอร์ และเป็นฟังก์ชัน diff
          ของฟังก์ชันก่อนหน้า (ไม่สามารถคำนวณด้วยฟังก์ชันที่เขียนทั่วไปได้)
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

export default NR;
