import { Component } from "react";
import BS from "./RO_C/BS";
import RO_Navbar from "./RO_C/RO_Navbar";
import "./Home.css";
import { Layout, Row, Col } from "antd";
const { Header, Content, Footer } = Layout;

export default class RO extends Component {
  render() {
    return (
      <Layout className="Layout">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <div className="container">
              <h1 className="fontFCBold"> Root of Equation </h1>
              <dd>
                <p
                  style={{
                    textAlign: "justify",
                    border: "3px solid red",
                    padding: "5px",
                  }}
                >
                  Root of Equation คือการแก้สมการเพื่อหาค่า x ในสมการ (หรือก็คือ
                  f(x)) ที่ให้ผลลัพธ์เท่ากับ 0 เช่น f(x)= 3x^2+5x+6 = 0 เป็นต้น.
                  เพื่อที่จะได้ไม่นำค่า x นั้น ไปคำนวณกับ
                  สมการอื่นๆที่อาจเกี่ยวข้องแล้วเกิดปัญหาบางอย่างขึ้น เช่น ปัญหา
                  divide by zero หรือการที่ตัวหาร (ซึ่งกรณีนี้คือ x) เป็น 0
                  นั่นเอง.
                </p>
              </dd>
              <p style={{ fontWeight: "Bold", textDecoration: "underline" }}>
                {" "}
                โดยวิธี Root of Equation แบบ Numerical Method แบ่งแยกไปได้เป็น 6
                ประเภทย่อย ได้แก่{" "}
              </p>
              <ul>
                <li>Graphical Method</li>
                <li>Bisection Method </li>
                <li>False Position Method</li>
                <li>One-Point Iteration Method</li>
                <li>Newton-Raphson Method</li>
                <li>Scant Method</li>
              </ul>
              <p className="bp"> &nbsp;</p>
            </div>
          </Col>
          <Row>
            <div>
              <RO_Navbar />
            </div>
          </Row>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}

/*Graphical Method : ทำการแทนค่า x ไปเรื่อยๆจำนวนหนึ่ง หลังจากนั้นเอามาสร้างเป็นกราฟเพื่อหาตำแหน่งที่ x = 0*/
