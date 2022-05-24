import "./App.css";
import FooterCompo from "./component/FooterCompo";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./component/HomeComponent";
import RO from "./component/RO_Compo.js";
import LAE from "./component/LAE_Compo.js";
import IE from "./component/IE_Compo";
import LSR from "./component/LSR_Compo";
import { Layout, Menu, Row, Col } from "antd";
import INDI from "./component/INDI_Compo";
const { Header, Footer } = Layout;

function App() {
  return (
    <Layout className="layout">
      <div style={{marginBottom: 5}}>
        <Router>
          <div>
            <Header>
              <Row>
                <Col span={24}>
                  <ul className="Horizontal-menu">
                    <li>
                      <Link to="/home">
                        <img
                          src={"/mylogo.png"}
                          alt="logo"
                          height={70}
                          style={{ verticalAlign: "middle", paddingRight: 20 }}
                        ></img>
                      </Link>
                    </li>
                    <li>
                      <Link to="/RO" className="special">
                        Root of Equation
                      </Link>
                    </li>
                    <li>
                      <Link to="/LAE" className="special">
                        {" "}
                        Linear Algebraic Equation{" "}
                      </Link>
                    </li>
                    <li>
                      <Link to="/IE" className="special">
                        {" "}
                        Interpolation & Regression{" "}
                      </Link>
                    </li>
                    <li>
                      <Link to="/LSR" className="special">
                        {" "}
                        LEAST-SQUARES REGRESSION{" "}
                      </Link>
                    </li>
                    <li>
                      <Link to="/INDI" className="special">
                        {" "}
                        INTEGRATION AND DIFFERENTIATION{" "}
                      </Link>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Header>
            <Routes>
              <Route path="/home" element={<Home style={{ margin: 50 }} />} />
              <Route path="/" element={<Navigate replace to="/home" />} />
              <Route path="/RO" element={<RO />} />
              <Route path="/LAE" element={<LAE />} />
              <Route path="/IE" element={<IE />} />
              <Route path="/LSR" element = {<LSR/>}/>
              <Route path="/INDI" element = {<INDI/>}/>
            </Routes>
          </div>
        </Router>
      </div>
      <Footer>
        <Row>
          <Col span={24}>
            <FooterCompo />
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}

export default App;

/*
<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/

/*
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
        {new Array(5).fill(null).map((_, index) => {
          const key = index + 1;
          return <Menu.Item key={key}>{`nav ${key}`}</Menu.Item>;
        })}
      </Menu>
      </div>
    </Header>
    <Divider />
    <Content style={{ padding: '0 50px' }}>
      <div className="site-layout-content">
        <App />
      </div>
    </Content>
    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>,
*/
