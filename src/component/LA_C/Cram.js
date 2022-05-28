import { Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import TeX from "@matejmazur/react-katex";
import {divide ,det} from "mathjs";
import './LA_c.css';
import axios from "axios";

//* Cramer's Rule

const Cram = () => {

    const [MatrixSize, setMatrixSize] = useState(3);
    const [Matrix, setMatrix] = useState(
      <div className="descep">
        <dd>
          กดปุ่มด้านล่างเพื่อเพิ่มแมตริกซ์ (+ : เพิ่มแถว/คอลัมน์ , - :
          ลบแถว/คอลัมน์)
        </dd>
      </div>
    );

    const [defaultMat , setDefMat] = useState(
      [
        [2,3,1],
        [3,4,5],
        [1,-2,1]
      ]
    );
    const [NumMatrix, setNumMatrix] = useState(null);
    const [B, setB] = useState(null);
    const [output, setOut] = useState(null);

    const inputB = (event) => {
      var temp = String(event.target.value);
      temp = temp.toString().split(" ");
      temp = temp.toString().split(",");
      setB(temp);
    };

    useEffect(() => {
      createMat();
    }, [MatrixSize]);

    function createMat() {
      let matrix = new Array(MatrixSize);
      for (let i = 0; i < MatrixSize; i++) {
        matrix[i] = new Array(MatrixSize).fill(0);
      }

      if (MatrixSize >= 2 && MatrixSize <= 8) {
        let j=0;
        try {
          setMatrix(
            matrix.map((row, indexRow = 1) => {
              return (
                <div
                  key={indexRow}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  {row.map((indexColumn = 1) => {
                    //console.log(indexRow + "," + (j));
                    //console.log(defaultMat[indexRow][indexColumn]);
                    if(j%MatrixSize == 0) {j=0;}
                    return (
                      <input
                        style={{ width: "10%" }}
                        className="form-control"
                        key={uuid()}
                        type="text"
                        defaultValue={defaultMat[indexRow][j++]}
                        name={indexRow + "," + indexColumn}
                      />
                    );
                  })}
                </div>
              );
            })
          );
        } catch (err) {
          return matrix.map((row, indexRow = 1) => {
            return (
              <div
                key={indexRow}
                style={{ display: "flex", paddingLeft: "43%" }}
              >
                {row.map((indexColumn = 1) => {
                  return (
                    <input
                      style={{ width: "10%" }}
                      className="form-control"
                      key={uuid()}
                      type="text"
                      defaultValue={0}
                      name={indexRow + "," + indexColumn}
                    />
                  );
                })}
              </div>
            );
          });
        }
      } else if (MatrixSize <= 1) {
        setMatrix(
          <div className="descep">
            <dd>
              กดปุ่มด้านล่างเพื่อเพิ่มแมตริกซ์ (+ : เพิ่มแถว/คอลัมน์ , - :
              ลบแถว/คอลัมน์)
            </dd>
          </div>
        );
      }
    }

    function exampleMat(){
      let matrix = new Array(3);
      for (let i = 0; i < 3; i++) {
        matrix[i] = new Array(3).fill(0);
      }
      let j=0;
      setMatrix(
        matrix.map((row, indexRow = 1) => {
          return (
            <div
              key={indexRow}
              style={{ display: "flex", justifyContent: "center" }}
            >
              {row.map((indexColumn = 1) => {
                if(j%3 == 0) {j=0;}
                return (
                  <input
                    style={{ width: "10%" }}
                    className="form-control"
                    key={uuid()}
                    type="text"
                    defaultValue={NumMatrix[indexRow][j++]}
                    name={indexRow + "," + indexColumn}
                  />
                );
              })}
            </div>
          );
        })
      );
    }

    const addSize = (event) => {
      if (MatrixSize < 8) {
        setMatrixSize(MatrixSize + 1);
      }
    };

    const minusSize = (event) => {
      if (MatrixSize > 1) {
        setMatrixSize(MatrixSize - 1);
      }
    };

    const handleMatrix = (event) => {
      event.preventDefault();
      let count = 0;
      var matrix = new Array(MatrixSize);
      for (let i = 0; i < MatrixSize; i++) {
        matrix[i] = new Array(MatrixSize);
        for (let j = 0; j < MatrixSize; j++) {
          //? If the floating point number cannot be parsed, we set 0 for this value
          matrix[i][j] = !isNaN(parseFloat(event.target[count].value))
            ? parseFloat(event.target[count].value)
            : 0;
          count += 1;
        }
      }
      setNumMatrix(matrix);

      // console.table(NumMatrix);
    };

    const renderMatrix = (matrix) => {
      return (
        "\\begin{pmatrix}\n" +
        matrix
          .map((row, index) => {
            if (index === matrix.length) return row.join(" & ") + "\n";
            else return row.join(" & ") + "\\\\\n";
          })
          .join("") +
        "\\end{pmatrix}"
      );
    };

    const renderVector = (vector) => {
      try {
        return (
          "\\begin{pmatrix}\n" +
          vector
            .map((row) => {
              return row.toFixed(6) + "\\\\";
            })
            .join("") +
          "\\end{pmatrix}"
        );
      } catch (error) {
        window.alert("Have Error!");
      }
    };

    //!----------------------------Calculate Module---------------------------------

    const Cramer_M = () =>{

        var X = new Array(B.length);

        var D_arr = det(NumMatrix);
        var D_x = new Array(B.length);
        var CopyNumMat =  JSON.parse(JSON.stringify(NumMatrix));
        
        for (var i = 0; i < B.length; i++) { //loop for x1 , x2 , ...

            CopyNumMat =  JSON.parse(JSON.stringify(NumMatrix));

            for(var j=0; j<NumMatrix.length; j++){ //loop for create D_X array
                CopyNumMat[j][i] = B[j];
            }

            D_x[i] = det(CopyNumMat);

            X[i] = divide(D_arr , D_x[i]);
        }

        setOut(
            <div className="OutputText" id="myout">
              <h1> Summary : </h1>
              <p>
                <b style={{ fontSize: 22 }}> <TeX math="Vector_B" /> : </b> &#40; {B.join(",") } &#41;
              </p>
              <p>
                <b style={{ fontSize: 22 }}> <TeX math="Array_X" /> : </b> <TeX math={"A = " + renderMatrix(NumMatrix)} />
              </p>
              <p style={{borderTop: "2px solid #dedede" }}> <b style={{ fontSize: 30 }}> Answer : </b></p>
              <p>
                <b style={{ fontSize: 22 , textIndent: 15}}> <TeX math="Vector_X" /> : </b> <TeX math={"X = " + renderVector(X)} />
              </p>
            </div>
        );
    }

    const confirm_Num = (event) => {
        event.preventDefault();
        Cramer_M();
        setB([]);
    };

    function callAPI() {
        const headers = {
          "x-auth-token":
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
        };
        axios
          .get("http://localhost:4000/api/LinearAlgebra", { headers })
          .then((response) => {
            for (let i = 0; i < response.data.result.length; i++) {
              if (response.data.result[i].id === "Cramer") {
                var temp = new Array(3);
                temp[0] = response.data.result[i].Mat0;
                temp[1] = response.data.result[i].Mat1;
                temp[2] = response.data.result[i].Mat2;
                setNumMatrix(temp);
                setB(response.data.result[i].B);
                exampleMat();
              }
            }
          });
    }
  
  
      return (
        <div>
          <h1 className="myheader">Cramer Rule</h1>
          <Form onSubmit={handleMatrix}>
            <h1 style={{ textIndent: "15%" }}>
              {" "}
              <b style={{ fontSize: 30 }}> Matrix Input : </b>
            </h1>
            {Matrix}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="success"
                style={{ marginTop: "2rem", marginInlineEnd: "41px" }}
                type="submit"
              >
                Confirm
              </Button>
              <Button
                style={{
                  marginTop: "2rem",
                  marginInlineStart: 0,
                  marginInlineEnd: "41px",
                }}
                onClick={addSize}
              >
                {" "}
                +{" "}
              </Button>
              <Button
                style={{
                  marginTop: "2rem",
                  marginInlineStart: 0,
                  marginInlineEnd: "41px",
                }}
                onClick={minusSize}
              >
                {" "}
                -{" "}
              </Button>
              <Button
                variant="secondary"
                style={{ marginTop: "2rem", marginInlineStart: 0 }}
                onClick={createMat}
              >
                Clear
              </Button>{" "}
            </div>
          </Form>

          <br />

          <Form onSubmit={confirm_Num} className="myform">
            <Form.Group>
              <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
                ค่าข้อมูล B
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="ใส่ชุดตัวเลข"
                aria-describedby="texthelp1"
                onChange={inputB}
                value={B}
              />
              <Form.Text
                id="texthelp1"
                muted
                style={{ fontSize: 15, color: "silver" }}
              >
                ค่าข้อมูลต้องเป็นชุดตัวเลขเท่านั้น. (จำนวนไม่เกินจำนวนแถวของ
                Matrix)
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
              <Button
                variant="primary"
                size="lg"
                onClick={callAPI}
                className="btn"
              >
                {" "}
                ตัวอย่าง{" "}
              </Button>{" "}
            </div>
            <br />

            <div id="myout">{output}</div>
            <br />
          </Form>
        </div>
      );  

}

export default Cram;

/*

 [2 , 3 , 1 ]
 [3 , 4 , 5 ]
 [1 , -2 , 1 ]

 [9 , 0 , -4]

*/