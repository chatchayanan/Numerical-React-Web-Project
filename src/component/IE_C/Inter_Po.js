import "./ie_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";
import axios from "axios";

/* 
      x   | y=f(x)
    ------------------
    0     | 9.81
    20000 | 9.7487
    40000 | 9.6879
    60000 | 9.6879
    80000 | 9.5682
*/

const Inter_Po = () => {
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
          if (response.data.result[i].id === "Newton") {
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

    let n = y.length; // ความยาวของจำนวนตัวแปรที่มี x0 ถึว xn
    var C_array = new Array(n); //สร้าง array 1 มิติ ก่อน (่javascript สร้าง 2 มิติทันทีไม่ได้)

    for (var i = 0; i < C_array.length; i++) {
      C_array[i] = new Array(n).fill(0); //แปลง array 1 มิติ ให้เป็น 2 มิติ default ค่าทุกตำแหน่ง = 0
      C_array[i][0] = y[i]; //เอาค่า yi = f(xi) มาใส่ใน column ซ้ายสุด
    }

    for (var j = 1; j < n; j++) {
      for (var i = 0; i < n - j; i++) {
        C_array[i][j] =
          (C_array[i + 1][j - 1] - C_array[i][j - 1]) /
          (x_arr[i + j] - x_arr[i]);
        // วนรอบหาค่า C1...Cn-1 โดยจำนวนค่าในแต่ละ C จะน้อยลงเรื่อยๆ ตามจำนวน loop ที่ผ่านไป (หรือก็คือ C เยอะ จำนวนคำตอบก็จะน้อยลงนั่นเอง)
      }
    }

    let xx = new Array(x_arr.length); //อาเรย์ xx คิอ array เก็บค่า (x-xi)จนถึง (x-xi)...(x-xn)
    let ans = C_array[0][0]; // inital ค่าแรก คือ C0 = f(x0)

    for (var i = 0; i < xx.length; i++) {
      if (i == 0)
        // ค่าแรกคือ (x-xi) เฉยๆ (ก่อนที่อันต่อๆไปจะคูณเพิ่มกับ xx ในตำแหน่งก่อนหน้าด้วย)
        xx[i] = X - x_arr[i];
      else {
        xx[i] = (X - x_arr[i]) * xx[i - 1]; //นำ (x-xi) ตำแหน่งที่แล้วมาคูณกับตำแหน่งปัจจุบัน เพื่อให้ได้ค่า (x-xi)...(x-xi ณ ตำแหน่งปัจจุบัน)
      }
    }

    for (let i = 1; i < C_array.length; i++) {
      ans += C_array[0][i] * xx[i - 1]; // Ci คูณกับ (x-x0)...(x-xi)
    }

    const columns = [
      {
        field: "C_index",
        headerName: "C ที่",
        headerClassName: "super-app-theme--header",
        headerAlign: "left",
        type: "string",
        width: 130,
      },
      {
        field: "value",
        headerName: "ค่าข้อมูล",
        headerClassName: "super-app-theme--header",
        width: 200,
        type: "string",
        flex: 1,
      },
    ];
    const rows = [];

    for (let i = 0; i < C_array.length; i++) {
      rows.push({
        internalId: uuid(),
        C_index: i.toString(),
        value: C_array[i].join(" , "),
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
      x: [x_arr[x_arr.length - 1] / 2.0],
      y: [ans],
      mode: "markers",
      type: "scatter",
      hovertemplate: "<i><b>Answer Value = </b></i>: %{y:.8f}",
      name: "Answer",
    };

    var data = [trace1, trace2];

    var layout = {
      title: {
        text: "Interpolation Graph",
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
        คำตอบสำหรับโจทย์นี้ก็คือ &nbsp; <b>{ans}</b>{" "}
      </p>
    );

    setOut(
      <div className="OutputText" id="myout">
        <h1> Summary : </h1>
        <p>
          <b style={{ fontSize: 22 }}>Array X : </b> {x_arr.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>Array Y : </b> {y.join(" , ")}
        </p>
        <p>
          <b style={{ fontSize: 22 }}>X ที่ต้องการหา : </b> {X}
        </p>
        <br />
        <h2> C Table </h2>
      </div>
    );
  };

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">Interpolation (Newton) </h1>
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

export default Inter_Po;

//ข้อ 1.1

// ? let x_arr_1 = [0, 80000]; //(2 จุด : จุด 1 กับ จุด 5)
// ? let y_arr_1 = [9.81, 9.5682];

//ข้อ 1.2
//? let x_arr_2 = [0, 40000, 80000]; //(3 จุด : จุด 1 , จุด 3 กับ จุด 5)
//? let y_arr_2 = [9.81, 9.6879, 9.5682];

//ข้อ 1.3
//?let x_arr = [0, 20000, 40000, 60000, 80000]; //(5 จุด : ทุกจุด)
//?let y_arr = [9.81, 9.7487, 9.6879, 9.6879, 9.5682];
