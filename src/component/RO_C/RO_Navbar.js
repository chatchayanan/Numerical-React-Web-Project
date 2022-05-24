import { Component } from "react";
import BS from "./BS";
import FP from "./FP";
import NR from "./NR";
import OP from "./OP";
import Scant from "./Scant";
import "./RO_Navbar_Style.css";

class RO_Navbar extends Component {
  constructor() {
    super();
    this.state = {
      Bisect: false,
      FalsePo: false,
      OnePoint: false,
      NewRarph: false,
      C_Scant: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {
/*
    const ChangeState_S = () => {
      this.setState({ Scant: false });
      console.log('SetState');
    };

    const ChangeState_Nr = () => {
      this.setState({ NewRarph: false });
      console.log('SetState');
    };

    const ChangeState_Op = () => {
      this.setState({ Onepoint: false });
      console.log('SetState');
    };

    const ChangeState_Fa = () => {
      this.setState({ FalsePo: false });
      console.log('SetState');
    };

    const ChangeState_Bi = () => {
      this.setState({ Bisect: false });
      console.log('SetState');
    };*/

    switch (name) {
      case "Bisect":
        this.setState({ Bisect: !this.state.Bisect });
       // ChangeState_Fa();
        //ChangeState_Op();
        //ChangeState_Nr();
       // ChangeState_S();
        break;
      case "FalsePo":
        this.setState({ FalsePo: !this.state.FalsePo });
        //ChangeState_Bi();
        //ChangeState_Op();
        //ChangeState_Nr();
        //ChangeState_S();
        break;
      case "OnePoint":
        this.setState({ OnePoint: !this.state.OnePoint });
        //ChangeState_Bi();
        //ChangeState_Fa();
        //ChangeState_Nr();
        //ChangeState_S();
        break;
      case "NewRarph":
        this.setState({ NewRarph: !this.state.NewRarph });
        //ChangeState_Another(name);
        //ChangeState_Fa();
        //ChangeState_Op();
        //ChangeState_Bi();
        //ChangeState_S();
        break;
      case "C_Scant":
        this.setState({ C_Scant: !this.state.C_Scant });
        //ChangeState_Fa();
        //ChangeState_Op();
        //ChangeState_Bi();
        //ChangeState_Nr();
        break;
      default:
        null;
    }
  }

  render() {
    const { Bisect, FalsePo, OnePoint, NewRarph, C_Scant } = this.state;
    return (
      <div>
        <ul className="ro_container">
          <li onClick={() => this.hideComponent("Bisect")}>
            {" "}
            Bisection Method{" "}
          </li>
          <li onClick={() => this.hideComponent("FalsePo")}>
            False Position Method
          </li>
          <li onClick={() => this.hideComponent("OnePoint")}>
            One-Point Iteration Method
          </li>
          <li onClick={() => this.hideComponent("NewRarph")}>
            Newton-Raphson Method
          </li>
          <li onClick={() => this.hideComponent("C_Scant")}> Scant Method </li>
        </ul>
        {Bisect && (
          <div className="item-container">
            <BS />
          </div>
        )}
        {FalsePo && (
          <div className="item-container">
            <FP />
          </div>
        )}
        {OnePoint && (
          <div className="item-container">
            <OP />
          </div>
        )}
        {NewRarph && (
          <div className="item-container">
            <NR />
          </div>
        )}
        {C_Scant && (
          <div className="item-container">
            <Scant />
          </div>
        )}
      </div>
    );
  }
}

export default RO_Navbar;
