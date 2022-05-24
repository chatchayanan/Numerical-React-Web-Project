import { Component } from "react";
import Le_R from "./Le_R";
import "./LSR_Navbar_Style.css";
import MeL_R from "./ML_R";
import Po_R from "./Po_R";

class LSR_Navbar extends Component {
  constructor() {
    super();
    this.state = {
      L_R: false,
      ML_R: false,
      P_R: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {
    switch (name) {
      case "L_R":
        this.setState({ L_R: !this.state.L_R });
        break;
      case "ML_R":
        this.setState({ ML_R: !this.state.ML_R });
        break;
      case "P_R":
        this.setState({ P_R: !this.state.P_R });
        break;
      default:
        null;
    }
  }

  render() {
    const { L_R, ML_R, P_R} = this.state;
    return (
      <div>
        <ul className="ie_container">
          <li onClick={() => this.hideComponent("L_R")}>
            Linear Regression
          </li>
          <li onClick={() => this.hideComponent("ML_R")}>
            Multiple Linear Regression
          </li>
          <li onClick={() => this.hideComponent("P_R")}>
            Polynomial Regression
          </li>
        </ul>

        
        {L_R && (
          <div className="item-container">
            <Le_R />
          </div>
        )}

          
        {ML_R && (
          <div className="item-container">
            <MeL_R />
          </div>
        )}

        
        
        {P_R && (
          <div className="item-container">
            <Po_R />
          </div>
        )}
      </div>
    );
  }
}

export default LSR_Navbar;
