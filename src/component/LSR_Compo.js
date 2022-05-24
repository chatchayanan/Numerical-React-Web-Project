import { Component } from "react";
import "./Home.css";
import { Layout, Row, Col } from "antd";
import LSR_Navbar from "./LSR_C/LSR_Navbar";
const { Header, Content, Footer } = Layout;

export default class LSR extends Component {
  render() {
    return (
      <Layout className="Layout">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <div className="container">
              <h1> Least squares Regression Function </h1>
              <p className="bp"> &nbsp;</p>
            </div>
            <Row>
              <div>
                <LSR_Navbar/>
              </div>
            </Row>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}