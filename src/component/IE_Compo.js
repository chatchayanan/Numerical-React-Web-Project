import { Component } from "react";
import "./Home.css";
import { Layout, Row, Col } from "antd";
import IE_Navbar from "./IE_C/IE_Navbar";
const { Header, Content, Footer } = Layout;

export default class IE extends Component {
  render() {
    return (
      <Layout className="Layout">
        <Row>
          <Col span={6}></Col>
          <Col span={12}>
            <div className="container">
              <h1> Interpolation & Regression </h1>
              <p className="bp"> &nbsp;</p>
            </div>
            <Row>
              <div>
                <IE_Navbar/>
              </div>
            </Row>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Layout>
    );
  }
}
