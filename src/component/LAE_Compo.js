import { Component } from "react";
import "./Home.css";
import { Layout, Row, Col } from "antd";
import LA_Navbar from "./LA_C/LA_Navbar";
const { Header, Content, Footer } = Layout;

export default class LAE extends Component {
  render() {
    return (
      <Layout className="Layout">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <div className="container">
              <h1> Linear Algebraic Equation </h1>
              <p className="bp"> &nbsp;</p>
            </div>
            <Row>
              <div>
                <LA_Navbar/>
              </div>
            </Row>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}
