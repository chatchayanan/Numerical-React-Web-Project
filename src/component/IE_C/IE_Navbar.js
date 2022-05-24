import { Component } from "react";
import "./IE_Navbar_Style.css";
import Inter_Po from "./Inter_Po";
import Inter_Po_L from "./Inter_Po_L";
import Spline_Cu from "./Spline_Cu";
import Spline_Li from "./Spline_Li";
import Spline_Qu from "./Spline_Qu";

class IE_Navbar extends Component {
  constructor() {
    super();
    this.state = {
      InterPo_N: false,
      InterPo_La: false,
      Spine_L: false,
      Spine_Q: false,
      Spine_C: false,
    };
    this.hideComponent = this.hideComponent.bind(this);
  }

  hideComponent(name) {
    switch (name) {
      case "InterPo_N":
        this.setState({ InterPo_N: !this.state.InterPo_N });
        break;
      case "InterPo_La":
        this.setState({ InterPo_La: !this.state.InterPo_La });
        break;
      case "Spine_L":
        this.setState({ Spine_L: !this.state.Spine_L });
        break;
      case "Spine_Q":
        this.setState({ Spine_Q: !this.state.Spine_Q });
        break;
      case "Spine_C":
        this.setState({ Spine_C: !this.state.Spine_C });
        break;
      default:
        null;
    }
  }

  render() {
    const { InterPo_N, InterPo_La, Spine_L, Spine_Q, Spine_C } = this.state;
    return (
      <div>
        <ul className="ie_container">
          <li onClick={() => this.hideComponent("InterPo_N")}>
            Interpolation &#40; Newton &#41;
          </li>
          <li onClick={() => this.hideComponent("InterPo_La")}>
            Interpolation &#40; Lagrange &#41;
          </li>
          <li onClick={() => this.hideComponent("Spine_L")}>
            Spline &#40; Linear &#41;
          </li>
          <li onClick={() => this.hideComponent("Spine_Q")}>
            Spline &#40; Quadratic &#41;
          </li>
          <li onClick={() => this.hideComponent("Spine_C")}>
            Spline &#40; Cubic &#41;
          </li>
        </ul>

        {InterPo_N && (
          <div className="item-container">
            <Inter_Po />
          </div>
        )}

        {InterPo_La && (
          <div className="item-container">
            <Inter_Po_L />
          </div>
        )}
        
        {Spine_L && (
          <div className="item-container">
            <Spline_Li />
          </div>
        )}

        {Spine_Q && (
          <div className="item-container">
            <Spline_Qu />
          </div>
        )}

        {Spine_C && (
          <div className="item-container">
            <Spline_Cu />
          </div>
        )}
      </div>
    );
  }
}

export default IE_Navbar;
