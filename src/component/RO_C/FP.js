import "./bsc.css";
import { Form, Button } from "react-bootstrap";
import { compile as cp } from "mathjs";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import uuid from "react-uuid";
import Box from "@mui/material/Box";
import Plotly from "plotly.js-dist";

const FP = () => {
  const [val_XR, setXR] = useState(0);
  const [val_XL, setXL] = useState(0);
  const [fun, setFun] = useState("");
  const [table, setTable] = useState(null);
  const [graph, setGraph] = useState(null);

  const inputXR = (event) => {
    setXR(event.target.value);
  };

  const inputXL = (event) => {
    setXL(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const confirm_Num = (event) => {
    event.preventDefault();
    FP_M();
    setXR(0);
    setXL(0);
    setFun("");
  };

  const FP_M = () => {
    var num = 0.2;
    var XL = Number(val_XL), //* XL = 0.02 , XR = 0.03
      XR = Number(val_XR);
    var X1 = 0,
      X1_old = 0;
    var funct = fun;  

    //แปลงมุมองศา เป็น เรเดียน
    
    var de_to_rad = (de) => {
      return de * (Math.PI / 180);
    };

    var sin = (X) => {
      return Math.sin(de_to_rad(X));
    }; //ฟังก์ชัน sin ในสูตร

    var sec = (X) => {
      return 1 / Math.cos(de_to_rad(X));
    }; //ฟังก์ชัน sec (หรือ cos**-1) ในสูตร
    
    //! สูตรสำหรับทดสอบ f(x) = sin(133 - 1 / x) - (x + (x * (sec(103 - 1 / x) * 21))) = 0
    function fx(fsx, X) {
      var math = cp(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    var xf = (xx, x) => {
      return xx * fx(funct , x);
    }; //XR*f(XL) หรือ XL*f(XR)

    var cal_x1 = (xr, xl) => {
      // คำนวณ X1
      return (xf(xl, xr) - xf(xr, xl)) / (fx(funct , xr) - fx( funct , xl));
    };

    //let f_xl;
    let f_xr, f_x1;
    let dataTable = [];
    let X = [];
    let Y = [];

    while (true) {
      //f_xl = fx(XL); //step1
      f_xr = fx(funct , XR);
      f_x1 = fx(funct , (X1 = cal_x1(XR, XL)));

      f_x1 * f_xr > 0 ? (XR = X1) : (XL = X1); //step2 และ step3 [if one line]

      //เช็คว่านี่คือรอบแรกของการรันหรือไม่? หากใช่จะข้ามขั้นตอนด้านล่าง แล้วเริ่มรอบถัดไป
      if (X1_old != 0) {
        num = Math.abs((X1 - X1_old) / X1); //step 4 เทียบค่า epsilon

        if (num < 0.000001) {
          console.log("answer = " + X1.toFixed(8));
          break;
        }
      }

      //X1_old = X1;

      dataTable.push({
        L: XL.toFixed(8),
        R: XR.toFixed(8),
        XOne: X1.toFixed(8),
        XOld: X1_old.toFixed(8),
        Err: num.toFixed(8),
      });
      X.push(X1.toFixed(8)); //X สำหรับกราฟแกน X
      Y.push(num.toFixed(8)); //Y สำหรับกราฟแกน Y

      X1_old = X1;
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
        field: "xL",
        headerName: "XL",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "xR",
        headerName: "XR",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "x1",
        headerName: "X",
        headerClassName: "super-app-theme--header",
        width: 200,
        flex: 1,
      },
      {
        field: "xold",
        headerName: "Xเก่า",
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
        xL: dataTable[i].L,
        xR: dataTable[i].R,
        x1: dataTable[i].XOne,
        xold: dataTable[i].XOld,
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
      x: X, //ค่า X1
      y: Y, //ค่า Error
      text: R, //ค่า Round
      mode: 'lines+markers',
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
        tickformat: ".8f",
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
  }

  return(
    <Form onSubmit={confirm_Num} className='myform'>
        <h2 className='fontFCBold'>False Position Method</h2>
        {/*
            <dd>
                <p style={{textAlign:'justify'}}> 
                    เป็นวิธีการที่ดัดแปลงมาจาก 'Binary Search (การหาข้อมูลโดยแบ่งครึ่งจำนวนข้อมูลทั้งหมดไปเรื่อยๆ)' โดยมีเงื่อนไขในการใช้ methodo นี้อยู่อย่างหนึ่ง
                    นั่นก็คือ...
                </p>
                <p style={{textAlign: 'left' , color:'red'}}> ค่า x ที่ใช้ต้องมีการเรียงลำดับมาแล้ว</p>
            </dd>*/
        }    
        <Form.Group>
            <Form.Label style={{textIndent:0 ,fontFamily:"FCRoundBold"}}>ค่าข้อมูล XL</Form.Label>
            <Form.Control type="number" placeholder="ใส่ค่า XL" aria-describedby="texthelp1" onChange={inputXL} value={val_XL} />
            <Form.Text id="texthelp1" muted style={{fontSize:15 , color:'silver'}}>
                ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
            </Form.Text>
        </Form.Group>

        <br/>

        <Form.Group>
            <Form.Label style={{textIndent:0 ,fontFamily:"FCRoundBold"}}>ค่าข้อมูล XR</Form.Label>
            <Form.Control type="number" placeholder="ใส่ค่าXR" aria-describedby="texthelp2" onChange={inputXR} value={val_XR}/>
            <Form.Text id="texthelp2" muted style={{fontSize:15 , color:'silver'}}>
                ค่าข้อมูลต้องเป็นตัวเลขเท่านั้น.
            </Form.Text>
        </Form.Group>

        <br />

        <Form.Group>
            <Form.Label style={{textIndent:0 , fontFamily:"FCRoundBold"}}>ฟังก์ชัน</Form.Label>
            <Form.Control type="text" placeholder="ระบุฟังก์ชันที่ต้องการคำนวณ" aria-describedby="texthelp3" onChange={inputFun} value={fun}/>
            <Form.Text id="texthelp3" muted style={{fontSize:15 , color:'silver'}}>
                ฟังก์ชันต้องอยู่ในรูปแบบฟังก์ชันคอมพิวเตอร์ (ไม่สามารถคำนวณด้วยฟังก์ชันที่เขียนทั่วไปได้)
            </Form.Text>
        </Form.Group>

        <br />
        <div>
            <Button variant="primary" size="lg" type="summit" className="btn"> ยืนยัน </Button>{' '}
        </div>

        <br />
        <div id = 'myTable' style={{height: '100%' }}>
            {table}
        </div>

        <div className="graph">
            <br/>  
                <div id="myChart"></div>
            <br/><br/>      
        </div>
    </Form>
    );
};

export default FP;
