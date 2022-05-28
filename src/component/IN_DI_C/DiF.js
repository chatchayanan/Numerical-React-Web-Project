import "./INDI_c.css";
import { Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import TeX from "@matejmazur/react-katex";
import { evaluate, compile } from "mathjs";
import nerdamer from "nerdamer/all.min";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import axios from "axios";

//* DIFFERENTIATION and ORDINARY DIFFERENTIAL EQUATIONS

const DiF = () => {

  const [X, setX] = useState(0);
  const [H, setH] = useState(0);
  const [Fun, setFun] = useState("");

  const [Fun_Status , setFunStatus] = useState("FDD"); //? FunStat = FDD | BDD | CDD
  const [OrderStatus , setOrderStatus] = useState(1); //? Order = 1 | 2
  const [DifStatus , setDifStatus] = useState(1);  //? Dif = 1 | 2 | 3 | 4 | 5

  const [output, setOut] = useState(null);
  const [answer, setAnswer] = useState(null);

  const inputX = (event) => {
    setX(event.target.value);
  };

  const inputH = (event) => {
    setH(event.target.value);
  };

  const inputFun = (event) => {
    setFun(event.target.value);
  };

  const inputFunStatus = (event) => {
      setFunStatus(event.target.value);
    //   console.log("Status = " + Status);
  }

  const inputDifStatus = (event) => {
      setDifStatus(event.target.value);
  }

  const inputOrderStatus = (event) => {
      setOrderStatus(event.target.value);
  }

  const confirm_Num = (event) => {
    event.preventDefault();
    DIFFERENTIATION();
    setX(0);
    setH(0);
    setFun("");
  };

  function callAPI() {
    const headers = {
      "x-auth-token":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc",
    };
    axios
      .get("http://localhost:4000/api/IntegrateAndDifferentiation", { headers })
      .then((response) => {
        for (let i = 0; i < response.data.result.length; i++) {
          if (response.data.result[i].id === "Differentiation") {
            setX(response.data.result[i].X);
            setH(response.data.result[i].H);
            setFun(response.data.result[i].Fun);
          }
        }
      });
  }

  const DIFFERENTIATION = () => {

    //!-----------------------------------------------------------

    function real_diff(fsx, order) {
      var diff = nerdamer("diff(" + fsx + ",x)");
      if (order > 1) {
        for (let i = 1; i < order; i++) {
          diff = nerdamer("diff(" + diff + ",x)");
        }
      }
      return diff.toString();
    }

    function fx(fsx, X) {
      var math = compile(fsx);
      let scope = { x: X };
      return math.evaluate(scope);
    }

    function true_err(Actual, normal) {
      var E = Math.abs((Actual - normal) / Actual) * 100;
      return E.toFixed(6);
    }

    function cal_error(df, x, normal) {
      var actual = fx(df, x);
      //console.log("Actual answer = " + actual.toFixed(6));
      return true_err(actual, normal);
    }

    function forward_DD(fun, xi, h, diff, order) {
      var answer = 0;
      switch (order) {
        case 1:
          switch (diff) {
            case 1:
              answer = (fx(fun, xi + h) - fx(fun, xi)) / h;
              break;
            case 2:
              answer =
                (fx(fun, xi + 2 * h) - 2 * fx(fun, xi + h) + fx(fun, xi)) /
                (h * h);
              break;
            case 3:
              answer =
                (fx(fun, xi + 3 * h) - 3 * fx(fun, xi + 2 * h) + fx(fun, xi)) /
                Math.pow(h, 3);
              break;
            case 4:
              answer =
                (fx(fun, xi + 4 * h) -
                  4 * fx(fun, xi + 3 * h) +
                  6 * fx(fun, xi + 2 * h) -
                  4 * fx(fun, xi + h) +
                  fx(fun, xi)) /
                Math.pow(h, 4);
              break;
            default:
              console.log("diff must be 1 , 2 , 3 or 4");
          }
          break;
        case 2:
          switch (diff) {
            case 1:
              answer =
                (-1 * fx(fun, xi + 2 * h) +
                  4 * fx(fun, xi + h) -
                  3 * fx(fun, xi)) /
                (2 * h);
              break;
            case 2:
              answer =
                (-1 * fx(fun, xi + 3 * h) +
                  4 * fx(fun, xi + 2 * h) -
                  5 * fx(fun, xi + h) +
                  2 * fx(fun, xi)) /
                (h * h);
              break;
            case 3:
              answer =
                (-3 * fx(fun, xi + 4 * h) +
                  14 * fx(fun, xi + 3 * h) -
                  24 * fx(fun, xi + 2 * h) +
                  18 * fx(fun, xi + h) -
                  5 * fx(fun, xi)) /
                (2 * Math.pow(h, 3));
              break;
            case 4:
              answer =
                (-2 * fx(fun, xi + 5 * h) +
                  11 * fx(fun, xi + 4 * h) -
                  24 * fx(fun, xi + 3 * h) +
                  26 * fx(fun, xi + 2 * h) -
                  14 * fx(fun, xi + h) +
                  3 * fx(fun, xi)) /
                Math.pow(h, 4);
              break;
            default:
              console.log("diff must be 1 , 2 , 3 or 4");
          }
          break;
        default:
          console.log(" order of h must be 1 or 2 ");
      }
      return answer;
    }

    function backward_DD(fun, xi, h, diff, order) {
        var answer = 0;
        switch (order) {
          case 1:
            switch (diff) {
              case 1:
                answer = (fx(fun, xi) - fx(fun, xi - h)) / h;
                break;
              case 2:
                answer =
                  (fx(fun, xi) - 2 * fx(fun, xi - h) + fx(fun, xi - 2 * h)) / (h * h);
                break;
              case 3:
                answer =
                  (fx(fun, xi) -
                    3 * fx(fun, xi - h) +
                    3 * fx(fun, xi - 2 * h) -
                    fx(fun, xi - 3 * h)) /
                  Math.pow(h, 3);
                break;
              case 4:
                answer =
                  (fx(fun, xi) -
                    4 * fx(fun, xi - h) +
                    6 * fx(fun, xi - 2 * h) -
                    4 * fx(fun, xi - 3 * h) +
                    fx(fun, xi - 4 * h)) /
                  Math.pow(h, 4);
                break;
              default:
                console.log(" diff must be 1 , 2 , 3 or 4");
            }
            break;
          case 2:
            switch (diff) {
              case 1:
                answer =
                  (3 * fx(fun, xi) - 4 * fx(fun, xi - h) + fx(fun, xi - 2 * h)) /
                  (2 * h);
                break;
              case 2:
                answer =
                  (2 * fx(fun, xi) -
                    5 * fx(fun, xi - h) +
                    4 * fx(fun, xi - 2 * h) -
                    fx(fun, xi - 3 * h)) /
                  (h * h);
                break;
              case 3:
                answer =
                  (5 * fx(fun, xi) -
                    18 * fx(fun, xi - h) +
                    24 * fx(fun, xi - 2 * h) -
                    14 * fx(fun, xi - 3 * h) -
                    fx(fun, xi - 4 * h)) /
                  (2 * Math.pow(h, 3));
                break;
              case 4:
                answer =
                  (3 * fx(fun, xi) -
                    14 * fx(fun, xi - h) +
                    26 * fx(fun, xi - 2 * h) -
                    24 * fx(fun, xi - 3 * h) +
                    11 * fx(fun, xi - 4 * h) -
                    2 * fx(fun, xi - 5 * h)) /
                  Math.pow(h, 4);
                break;
              default:
                console.log("diff must be 1 , 2 , 3 or 4");
            }
            break;
          default:
            console.log("order of h must be 1 or 2");
        }
        return answer;
      }
      
      function central_DD(fun, xi, h, diff, order) {
        var answer = 0;
        switch (order) {
          case 1:
            switch (diff) {
              case 1:
                answer = (fx(fun, xi + h) - fx(fun, xi - h)) / (2 * h);
                break;
              case 2:
                answer =
                  (fx(fun, xi + h) - 2 * fx(fun, xi) + fx(fun, xi - h)) / (h * h);
                break;
              case 3:
                answer =
                  (fx(fun, xi + 2 * h) -
                    2 * fx(fun, xi + h) +
                    2 * fx(fun, xi - h) -
                    fx(fun, xi - 2 * h)) /
                  (2 * Math.pow(h, 3));
                break;
              case 4:
                answer =
                  (fx(fun, xi + 2 * h) -
                    4 * fx(fun, xi + h) +
                    6 * fx(fun, xi) -
                    4 * fx(fun, xi - h) +
                    fx(fun, xi - 2 * h)) /
                  Math.pow(h, 4);
                break;
              default:
                console.log("diff must be 1 , 2 , 3 or 4");
            }
            break;
          case 2:
            switch (diff) {
              case 1:
                answer =
                  (-1 * fx(fun, xi + 2 * h) +
                    8 * fx(fun, xi + h) -
                    8 * fx(fun, xi - h) +
                    fx(fun, xi - 2 * h)) /
                  (12 * h);
                break;
              case 2:
                answer =
                  (-1 * fx(fun, xi + 2 * h) +
                    16 * fx(fun, xi + h) -
                    30 * fx(fun, xi) +
                    16 * fx(fun, xi - h) -
                    fx(fun, xi - 2 * h)) /
                  (12 * (h * h));
                break;
              case 3:
                answer =
                  (-1 * fx(fun, xi + 3 * h) +
                    8 * fx(fun, xi + 2 * h) -
                    13 * fx(fun, xi + h) +
                    13 * fx(fun, xi - h) -
                    8 * fx(fun, xi - 2 * h) +
                    fx(fun, xi - 3 * h)) /
                  (8 * Math.pow(h, 3));
                break;
              case 4:
                answer =
                  (-1 * fx(fun, xi + 3 * h) +
                    12 * fx(fun, xi + 2 * h) -
                    39 * fx(fun, xi + h) +
                    56 * fx(fun, xi) -
                    39 * fx(fun, xi - h) +
                    12 * fx(fun, xi - 2 * h) -
                    fx(fun, xi - 3 * h)) /
                  (6 * Math.pow(h, 4));
                break;
              default:
                console.log("diff must be 1 , 2 , 3 or 4");
            }
            break;
          default:
            console.log("order of h must be 1 or 2");
        }
        return answer;
    }

    //!--------------------------------------------------------------

    let x = Number(X),
      h = Number(H),
      order = Number(OrderStatus),
      dif = Number(DifStatus);
    var funct = Fun;

    var cal_option = Fun_Status; //? ฟังก์ชั่นวิธีคำนวณ Dif ที่เลือก

    var diff_funct = real_diff(funct, order);
    var answer = 0;

    switch (cal_option) {
      case "FDD":
        answer = forward_DD(funct, x, h, dif, order);
        break;
      case "BDD":
        answer = backward_DD(funct, x, h, dif, order);
        break;
      case "CDD":
        answer = central_DD(funct, x, h, dif, order);
        break;
      default:
        answer = 0;
    }

    var err = cal_error(diff_funct.toString(), x, answer);
    //console.log(answer);

    setAnswer(
        <p className="AnswerStyle">
          ค่าความผิดพลาด <b> (Error) </b> ในการคาดเดา เท่ากับ &nbsp;{" "}
          <i style={{ color: "red" }}>E</i> = <b>{err}</b>{" "}
        </p>
    );

    setOut(
        <div className="OutputText" id="myout">
          <h1 style={{marginBottom: 40}}> Summary : </h1>

          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm X_i" /> : </b> {x} </p>
          <p> <b style={{ fontSize: 22}}> <TeX math=" \bm F(X_{0})" /> : </b> {(fx(funct, x)).toFixed(6)} </p>

          <br/>

          <h2 style={{paddingBottom: "0%"}}> Actual Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> <TeX math="I_{Actual}"/> = {(fx(diff_funct,x)).toFixed(6)}</b> </p>

          <br />

          <h2 style={{ paddingBottom: "0%"}}> Predict Integrate : </h2>
          <p> <b style={{ fontSize: 22 }}> <TeX math="I_{Predict}"/> =  {(answer).toFixed(6)} </b> </p>

          <br />

        </div>
      );
  }

  return (
    <Form onSubmit={confirm_Num} className="myform">
      <h1 className="myheader">DIFFERENTIATION</h1>

      <FormControl color="primary">
        <FormLabel
          id="RowRadio"
          style={{ color: "white", fontSize: 25, font: "FCRoundRegular" }}
        >
          Calculated Type
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="RowRadio"
          name="row-radio-buttons-group"
          defaultValue="FDD"
          value={Fun_Status}
          onChange={inputFunStatus}
          sx={{
            bgcolor: "white",
            color: "black",
            borderRadius: "15px",
          }}
        >
          <FormControlLabel
            sx={{ borderRight: "0.5px solid #cdcfd1" }}
            value="FDD"
            control={<Radio />}
            label="Forward Divided-Difference &nbsp; "
          />
          <FormControlLabel
            sx={{ borderRight: "0.5px solid #cdcfd1" }}
            value="BDD"
            control={<Radio />}
            label="Backward Divided-Difference &nbsp; "
          />
          <FormControlLabel
            value="CDD"
            control={<Radio />}
            label="Central Divided-Difference &nbsp; "
          />
        </RadioGroup>
      </FormControl>

      <br />
      <br />

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <section>
          <FormControl color="primary">
            <FormLabel
              id="RowRadio"
              style={{ color: "white", fontSize: 25, font: "FCRoundRegular" }}
            >
              Diff Level
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="RowRadio"
              name="row-radio-buttons-group"
              defaultValue="1"
              value={DifStatus}
              onChange={inputDifStatus}
              sx={{
                bgcolor: "white",
                color: "black",
                borderRadius: "15px",
              }}
            >
              <FormControlLabel
                sx={{ borderRight: "0.5px solid #cdcfd1" }}
                value="1"
                control={<Radio />}
                label="1 &nbsp; "
              />
              <FormControlLabel
                sx={{ borderRight: "0.5px solid #cdcfd1" }}
                value="2"
                control={<Radio />}
                label="2 &nbsp; "
              />
              <FormControlLabel
                sx={{ borderRight: "0.5px solid #cdcfd1" }}
                value="3"
                control={<Radio />}
                label="3 &nbsp; "
              />
              <FormControlLabel
                value="4"
                control={<Radio />}
                label="4 &nbsp; "
              />
            </RadioGroup>
          </FormControl>
        </section>

        <section>
        <FormControl color="primary">
          <FormLabel
            id="RowRadio"
            style={{ color: "white", fontSize: 25, font: "FCRoundRegular" }}
          >
            Order Option
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="RowRadio"
            name="row-radio-buttons-group"
            defaultValue="1"
            value={OrderStatus}
            onChange={inputOrderStatus}
            sx={{
              bgcolor: "white",
              color: "black",
              borderRadius: "15px",
            }}
          >
            <FormControlLabel
              sx={{ borderRight: "0.5px solid #cdcfd1" }}
              value="1"
              control={<Radio />}
              label="Normal &nbsp; "
            />
            <FormControlLabel
              value="2"
              control={<Radio />}
              label="Exponent 2 &nbsp; "
            />
          </RadioGroup>
        </FormControl>
        </section>
      </div>

      <br />

      <Form.Group>
        <Form.Label style={{ textIndent: 0, fontFamily: "FCRoundBold" }}>
          ค่าข้อมูล X
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่าตัวเลข 1 ค่า"
          aria-describedby="texthelp1"
          onChange={inputX}
          value={X}
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
          ค่าข้อมูล H
        </Form.Label>
        <Form.Control
          type="number"
          placeholder="ใส่ค่าตัวเลข 1 ค่า"
          aria-describedby="texthelp2"
          onChange={inputH}
          value={H}
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
          ฟังก์ชัน <TeX math="F(X)" /> สำหรับการคำนวณ
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="ใส่ฟังก์ชั่นที่ต้องการหา"
          aria-describedby="texthelp3"
          onChange={inputFun}
          value={Fun}
        />
        <Form.Text
          id="texthelp3"
          muted
          style={{ fontSize: 15, color: "silver" }}
        >
          ค่าข้อมูลต้องเป็นฟังก์ชั่นเท่านั้น.
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
      {answer}
    </Form>
  );

};

export default DiF;

/*
const x = 2,
h = 0.25;
//e = 2.718281828459045;
const x2 = -2.5,
h2 = 0.1;
var funct = "e^x";
var funct2 = "e^(x/3) + x^2";

var diff_funct = real_diff(funct, 1);
var diff_funct2 = real_diff(funct2, 2);

*/