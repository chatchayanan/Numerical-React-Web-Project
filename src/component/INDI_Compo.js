import { Component } from "react";
import "./Home.css";
import { Layout, Row, Col } from "antd";
import INDI_Navbar from "./IN_DI_C/INDI_Navbar";
const { Header, Content, Footer } = Layout;

export default class INDI extends Component {
  render() {
    return (
      <Layout className="Layout">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <div className="container">
              <h1> NUMERICAL INTEGRATION AND DIFFERENTIATION </h1>
              <p className="bp"> &nbsp;</p>
            </div>
            <Row>
              <div>
                <INDI_Navbar />
              </div>
            </Row>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}
