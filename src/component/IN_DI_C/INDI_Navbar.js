import { Component } from "react";
import CSi_R from "./CSi_R";
import CTr_R from "./CTr_R";
import DiF from "./DiF";
import "./INDI_Nav_Style.css";
import Si_R from "./Si_R";
import Tr_R from "./Tr_R";

class INDI_Navbar extends Component {
  constructor() {
    super();
    this.state = {
      S_R: false,
      T_R: false,
      CS_R: false,
      CT_R: false,
      DIF: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {
    switch (name) {
      case "S_R":
        this.setState({ S_R: !this.state.S_R });
        break;
      case "T_R":
        this.setState({ T_R: !this.state.T_R });
        break;
      case "CS_R":
        this.setState({ CS_R: !this.state.CS_R });
        break;
      case "CT_R":
        this.setState({ CT_R: !this.state.CT_R });
        break;
      case "DIF":
        this.setState({ DIF: !this.state.DIF });
        break;
      default:
        null;
    }
  }

  render() {
    const { S_R, T_R, CS_R, CT_R , DIF } = this.state;
    return (
      <div>
        <ul className="ie_container">
          <li onClick={() => this.hideComponent("T_R")}>Trapezoidal Rule</li>
          <li onClick={() => this.hideComponent("CT_R")}>
            Composite Trapezoidal Rule
          </li>
          <li onClick={() => this.hideComponent("S_R")}>SIMPSON'S RULE</li>
          <li onClick={() => this.hideComponent("CS_R")}>
            COMPOSITE SIMPSON'S RULE
          </li>
          <li onClick={() => this.hideComponent("DIF")}>DIFFERENTIATION</li>
        </ul>

        {T_R && (
          <div className="item-container">
            <Tr_R />
          </div>
        )}

        {CT_R && (
          <div className="item-container">
            <CTr_R />
          </div>
        )}

        {S_R && (
          <div className="item-container">
            <Si_R />
          </div>
        )}

        {CS_R && (
          <div className="item-container">
            <CSi_R />
          </div>
        )}

        {DIF && (
          <div className="item-container">
            <DiF/>
          </div>
        )}    
      </div>
    );
  }
}

export default INDI_Navbar;
