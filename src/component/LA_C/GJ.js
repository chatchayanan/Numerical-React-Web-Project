import { Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import TeX from "@matejmazur/react-katex";
import "./LA_c.css";
import axios from "axios";

//*  Gauss Jordan method

const GJ = () => {
  const [MatrixSize, setMatrixSize] = useState(3);
  const [Matrix, setMatrix] = useState(
    <div className="descep">
      <dd>
        กดปุ่มด้านล่างเพื่อเพิ่มแมตริกซ์ (+ : เพิ่มแถว/คอลัมน์ , - :
        ลบแถว/คอลัมน์)
      </dd>
    </div>
  );
  const [NumMatrix, setNumMatrix] = useState(
    [
      [0,0,0],
      [0,0,0],
      [0,0,0]
    ]
  );
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
      try {
        setMatrix(
          matrix.map((row, indexRow = 1) => {
            return (
              <div
                key={indexRow}
                style={{ display: "flex", justifyContent: "center" }}
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
          })
        );
      } catch (err) {
        return matrix.map((row, indexRow = 1) => {
          return (
            <div key={indexRow} style={{ display: "flex", paddingLeft: "43%" }}>
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

  const GJ_M = () => {

      var A = JSON.parse(JSON.stringify(NumMatrix));
      var b = JSON.parse(JSON.stringify(B));

      if(A[0][0] === 0){
        //TODO : pivoting (เหมือน Gauss Eilimenate)
        var tempRow = JSON.parse(JSON.stringify(A[0]));
        var tempColumn = b[0];
        A[0] = A[1];
        A[1] = tempRow;
        b[0] = b[1];
        b[1] = tempColumn;
      }

      //TODO : Forward eliminated (เหมือน Gauss Eilimenate)

      for (var k = 0; k < MatrixSize; k++) {

        for (var i = k + 1; i < MatrixSize; i++) {

          var factor = A[i][k] / A[k][k];

          for (var j = k; j < MatrixSize; j++) {

            A[i][j] = A[i][j] - factor * A[k][j];

          }

          b[i] = b[i] - factor * b[k];

        }
      }

       //TODO : Backward Substitution
       //!      (รูปแบบใหม่ของ Jordan)

       ////var X = new Array(MatrixSize); (ไม่ใช้แล้ว)
       var X_ans = new Array(MatrixSize);

       for (k = MatrixSize - 1; k >= 0; k--) {
         for (i = k; i >= 0; i--) {

           if (i === k) {

             //? Identity matrix เมทริกซ์เอกลักษณ์ 
             //? เมตริกซ์ ที่มีสมาชิกทุกตัวบนเส้นทแยงมุมมีค่าเท่ากับ 1

             factor = 1 / A[i][k];

             for (j = 0; j < MatrixSize; j++) {
               A[i][j] = A[i][j] * factor;
             }

             b[i] = b[i] * factor;

           } else {

             factor = A[i][k] / A[k][k];

             for (j = 0; j < MatrixSize; j++) {

               A[i][j] = A[i][j] - factor * A[k][j];

             }

             b[i] = b[i] - factor * b[k];

           }
         }
       }

      for (i = 0; i < MatrixSize; i++) {
        X_ans[i] = b[i];
      }

      setOut(
        <div className="OutputText" id="myout">
          <h1> Summary : </h1>
          <p>
            <b style={{ fontSize: 22 }}> <TeX math="Vector_B" /> : </b> &#40; {B.join(" , ") } &#41;
          </p>
          <p>
            <b style={{ fontSize: 22 }}> <TeX math="Array_X" /> : </b> <TeX math={"A = " + renderMatrix(NumMatrix)} />
          </p>
          <p style={{borderTop: "2px solid #dedede" }}> <b style={{ fontSize: 30 }}> Answer : </b></p>
          <p>
            <b style={{ fontSize: 22 , textIndent: 15}}> <TeX math="Vector_X" /> : </b> <TeX math={"X = " + renderVector(X_ans)} />
          </p>
        </div>
    );
  }

  //!----------------------------Calculate Module---------------------------------

  const confirm_Num = (event) => {
    event.preventDefault();
    GJ_M();
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
          if (response.data.result[i].id === "GaussJordan") {
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
      <h1 className="myheader">Gauss Jordan Method</h1>
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
            ค่าข้อมูลต้องเป็นชุดตัวเลขเท่านั้น. (จำนวนไม่เกินจำนวนแถวของ Matrix)
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
        <br />
      </Form>
    </div>
  );

};

export default GJ;

/*

 [2 , 3 , 1 ]
 [3 , 4 , 5 ]
 [1 , -2 , 1 ]

 [9 , 0 , -4]

*/
