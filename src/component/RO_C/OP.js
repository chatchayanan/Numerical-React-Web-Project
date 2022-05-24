import "./bsc.css";
import { Form, Button } from "react-bootstrap";
import { compile as cp, sqrt } from "mathjs";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";

const OP = () => {
  const [val_Xi, setXi] = useState(0);
  const [fun, setFun] = useState("");
  const [table, setTable] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputXi = (event) => {
    setXi(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    OP_M();
    setXi(0);
    setFun("");
  };

  const OP_M = () => {
    function fx(fsx, X) {
      var math = cp(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    var num = 0.5;
    var Xi_1 = 0,
      Xi = Number(val_Xi);
    var funct = fun;

    //*แปลงมุมองศา เป็น เรเดียน
    var de_to_rad = (de) => {
      return de * (Math.PI / 180);
    };

    //*ฟังก์ชัน sin แบบใช้องศา
    var sin = (x) => {
      return Math.sin(de_to_rad(x));
    };

    //ฟังก์ชันส่วนประกอบใน f(x)
    /*
  var f_1 = (x) => {
    return Math.sqrt(36) * x * (1 / 3);
  };
  var f_2 = (x) => {
    return 2 * sin(60 * x);
  };
  var f_3 = (x) => {
    return 2 / 4 + x - (x + x);
  };*/

    //!ฟังก์ขัน f(x) =  ((2/4 + x) - (x + x)) + ( (sqrt(36)* x) * (1/3) ) - (2 * sin( 60 * x )) + ( 2 * (1/4))

    //*เทียบค่า epsilon
    var ep = (xi, xi_old) => {
      return Math.abs((xi - xi_old) / xi);
    };

    let dataTable = [];
    let X = [];
    let Y = [];

    while (true) {
      Xi_1 = fx(funct, Xi);
      num = ep(Xi_1, Xi);
      Xi = Xi_1;

      if (num < 0.000001) {
        console.log("answer = " + Xi_1.toFixed(6));
        break;
      }

      dataTable.push({
        XI: Xi.toFixed(8),
        FXI: Xi_1.toFixed(8),
        Err: num.toFixed(8),
      });
      X.push(Xi_1.toFixed(8)); //X สำหรับกราฟแกน X
      Y.push(num.toFixed(8)); //Y สำหรับกราฟแกน Y
    }

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
        field: "xi",
        headerName: "Xi",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "fxi",
        headerName: "F_Xi",
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
    var R = [];
    for (let i = 0; i < dataTable.length; i++) {
      rows.push({
        internalId: uuid(),
        round: i + 1,
        xi: dataTable[i].XI,
        fxi: dataTable[i].FXI,
        eR: dataTable[i].Err,
      });
      R.push(i+1);
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
      x: X, //? ค่า F_xi
      y: Y, //?ค่า Error
      text: R, //?ค่า Round
      type: "scatter",
      hovertemplate:
        "<i><b>X</b></i>: %{x:.8f}" +
        "<br><b>Error</b>: %{y:.8f}<br>" +
        "<b>Round: %{text}</b>",
    };

    var layout = {
      title: {
        text: "ตารางเปรียบเทียบค่า f(X) ที่ได้ และ Error",
        font: {
          family: "FCRoundBold",
          size: 24,
        },
      },
      xaxis: {
        title: {
          text: "ค่า f(X) ที่คำนวณได้",
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
      <h2 className="fontFCBold">One-Iteration Method</h2>
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
      </dd>
        */}
      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล Xi
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่า Xi"
          aria-describedby="texthelp1"
          onChange={inputXi}
          value={val_Xi}
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

export default OP;
