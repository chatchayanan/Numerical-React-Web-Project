import './bsc.css';
import { Form , Button } from 'react-bootstrap';
import { compile as cp} from 'mathjs'
import React, { useState} from "react";
import { DataGrid } from '@mui/x-data-grid';
import uuid from 'react-uuid'
import Box from '@mui/material/Box';
import Plotly from 'plotly.js-dist'
import axios from "axios";


const BS = () =>{

    const [val_XR , setXR] = useState(0);
    const [val_XL , setXL] = useState(0);
    const [fun , setFun] = useState('');
    const [table , setTable] = useState(null);
    const [graph,setGraph] = useState(null);

    const inputXR = (event) =>{
        setXR(event.target.value);
    }

    const inputXL = (event) =>{
        setXL(event.target.value);
    }

    const inputFun = (event) =>{
        setFun(event.target.value);
    }

    const confirm_Num = (event) =>{
        event.preventDefault();
        BS_M();
        setXR(0);
        setXL(0);
        setFun('');
    }

    function callAPI(){
        const headers = {
            "x-auth-token":
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
        };
        axios
            .get("http://localhost:4000/api/rootofequation", { headers })
            .then((response) => {
                for (let i = 0; i < response.data.result.length; i++) {
                    if (response.data.result[i].id === "bisection") {
                      setXR(response.data.result[i].val_XR);
                      setXL(response.data.result[i].val_XL);
                      setFun(response.data.result[i].fun);
                    }
                }
            });
    }

    const BS_M = () => {

        function fx (fsx , X) {
            var math = cp(fsx);
            let scope = {x : X };
            return math.evaluate(scope);
        }
    
        let num = 5;
        let XL = Number(val_XL) , XR = Number(val_XR);
        var funct = fun;

        //! let XL = 1.5 , XR = 2.0;
        //! var funct = "1-((x^2)/13^(1/2))";

        let XM = XL;
        let dataTable=[];
        let X=[];
        let Y=[];
        
        while( XR-XL >= 0.000001 ){
            XM = (XL + XR) / 2;
    
            if(fx(funct , XM) == 0) break;
            else if(fx(funct , XM) * fx(funct , XR) > 0){
                num = Math.abs((XM - XR) / XM);  
                XR = XM ;          
            }
            else{
                num = Math.abs((XM - XL) / XM);  
                XL = XM ;
            }
    
            dataTable.push({
                L: XL.toFixed(8),
                R: XR.toFixed(8),
                M: XM.toFixed(8),
                Err: num.toFixed(8),
            })
            X.push(XM.toFixed(8)); //X สำหรับกราฟแกน X
            Y.push(num.toFixed(8)); //Y สำหรับกราฟแกน Y
        }
        
        const columns = [
            { field: 'round', headerName: 'Round', headerClassName: 'super-app-theme--header', headerAlign: 'left', type: 'number' , width: 130},
            { field: 'xL', headerName: 'XL' , headerClassName: 'super-app-theme--header' , width: 200 ,  flex: 1 },
            { field: 'xR', headerName: 'XR' , headerClassName: 'super-app-theme--header' , width: 200 ,  flex: 1 },
            { field: 'xM', headerName: 'XM' , headerClassName: 'super-app-theme--header' , width: 200 ,  flex: 1 },
            { field: 'eR', headerName: 'ERROR' , headerClassName: 'super-app-theme--header' , width: 200  },
        ];
        const rows = [];
        let R =[];
        for(let i=0; i<dataTable.length; i++){
            rows.push(
                { internalId: uuid() , round: i+1, xL: dataTable[i].L , xR: dataTable[i].R , xM: dataTable[i].M , eR: dataTable[i].Err },
            )
            R.push(i+1);
        }
    
        setTable(
            <Box
                sx ={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'primary.light',
                    '.MuiDataGrid-columnHeaders':{
                        backgroundColor: '#ffffff',
                    },
                    '.MuiDataGrid-cell':{
                        backgroundColor: '#fafafa',
                    },
                    '& .super-app-theme--header': {
                        backgroundColor: '#ffffff',
                    },
                    '& .MuiDataGrid-cell:hover': {
                        backgroundColor: '#eeeeee',
                        color: 'primary.main',
                    },
                    '.MuiDataGrid-footerContainer':{
                        backgroundColor: '#ffffff',
                    },
                }}
            >
            <DataGrid style={{height: 500}}
                columns={columns}
                rows={rows}
                getRowId={(rows) => rows.internalId}
            />
            </Box>
        )
        
        var data = {  // data สำหรับ plot กราฟ
            x: X, //ค่า XM
            y: Y, //ค่า Error
            text: R, //ค่า Round
            type: 'scatter',
            hovertemplate:  '<i><b>X</b></i>: %{x:.8f}' +
                            '<br><b>Error</b>: %{y:.8f}<br>' +
                            '<b>Round: %{text}</b>',
        };
        var layout = {
            title: {
                text:'ตารางเปรียบเทียบค่า X ที่ได้ และ Error',
                font: {
                  family: 'FCRoundBold',
                  size: 24
                },
            },
            xaxis: {
               title: {
                    text: 'ค่า X ที่คำนวณได้',
                    font: {
                      family: 'FCRoundRegular',
                      size: 18,
                      color: '#7f7f7f'
                    }
              },
              autorange: true,
              tickformat : '.2f',
              showlegend: false
            },
            yaxis: {
                title: {
                    text: 'ค่า Error ความคลาดเคลื่อน',
                    font: {
                      family: 'FCRoundRegular',
                      size: 18,
                      color: '#7f7f7f'
                    }
                },
              autorange: true,
              tickformat : '.2f',
              showlegend: false
            }
        };

        setGraph(
            Plotly.newPlot('myChart', [data], layout)
        )
    } 
        return(
            <Form onSubmit={confirm_Num} className='myform'>
                <h2 className='fontFCBold'>Bisection  Method</h2>
                    <dd>
                        <p style={{textAlign:'justify'}}> 
                            เป็นวิธีการที่ดัดแปลงมาจาก 'Binary Search (การหาข้อมูลโดยแบ่งครึ่งจำนวนข้อมูลทั้งหมดไปเรื่อยๆ)' โดยมีเงื่อนไขในการใช้ methodo นี้อยู่อย่างหนึ่ง
                            นั่นก็คือ...
                        </p>
                        <p style={{textAlign: 'left' , color:'red'}}> ค่า x ที่ใช้ต้องมีการเรียงลำดับมาแล้ว</p>
                </dd>
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
                <div>
                    <Button variant="primary" size="lg" onClick={callAPI} className="btn"> ตัวอย่าง </Button>{' '}
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
} 
export default BS;       