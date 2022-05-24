import { Component } from "react";
import "./LA_Nav_Style.css";
import Jacob from "./Jacob";
import GSI from "./GSI";
import CGM from "./CGM";
import Cram from "./Cram";
import GE from "./GE";
import GJ from "./GJ";
import LU_D from "./LU_D";

class LA_Navbar extends Component {
  constructor() {
    super();
    this.state = {
      Cramer: false,
      GaussElim: false,
      GaussJor: false,
      LUDecom: false,
      Jacobi: false,
      GaussSei: false,
      Conjugate: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {

    switch (name) {
      case "Cramer":
        this.setState({ Cramer: !this.state.Cramer });
        break;
      case "GaussElim":
        this.setState({ GaussElim: !this.state.GaussElim });
        break;
      case "GaussJor":
        this.setState({ GaussJor: !this.state.GaussJor });
        break;
      case "LUDecom":
        this.setState({ LUDecom: !this.state.LUDecom });
        break;
      case "Jacobi":
        this.setState({ Jacobi: !this.state.Jacobi });
        break;
      case "GaussSei":
          this.setState({ GaussSei: !this.state.GaussSei });
        break;
      case "Conjugate":
          this.setState({ Conjugate: !this.state.Conjugate });
        break;
      default:
        null;
    }
  }

  render() {
    const { Cramer, GaussElim, GaussJor, LUDecom, Jacobi , GaussSei , Conjugate } = this.state;
    return (
      <div>
        <ul className="ie_container">
          <li onClick={() => this.hideComponent("Cramer")}> Cramer Rule </li>
          <li onClick={() => this.hideComponent("GaussElim")}>
            Gauss Elimination Method
          </li>
          <li onClick={() => this.hideComponent("GaussJor")}>
            Gauss-Jordan Method
          </li>
          <li onClick={() => this.hideComponent("LUDecom")}>
            LU Decomposition Method
          </li>
          <li onClick={() => this.hideComponent("Jacobi")}>
            {" "}
            Jacobi Iteration Method{" "}
          </li>
          <li onClick={() => this.hideComponent("GaussSei")}>
            {" "}
            Gauss-Seidel Iteration{" "}
          </li>
          <li onClick={() => this.hideComponent("Conjugate")}>
            {" "}
            Conjugate Gradient Method{" "}
          </li>
        </ul>

        {Jacobi && (
          <div className="item-container">
            <Jacob />
          </div>
        )}

        {GaussSei && (
          <div className="item-container">
            <GSI />
          </div>
        )}

        {Conjugate && (
          <div className="item-container">
            <CGM />
          </div>
        )}

        {Cramer && (
          <div className="item-container">
            <Cram />
          </div>
        )}

        {GaussElim && (
          <div className="item-container">
            <GE />
          </div>
        )}

        {GaussJor && (
          <div className="item-container">
            <GJ />
          </div>
        )}

        {LUDecom && (
          <div className="item-container">
            <LU_D/>
          </div>
        )}
      </div>
    );
  }
}

export default LA_Navbar;
