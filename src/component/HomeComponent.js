import { Component } from "react";
import Introduction from './numer_introduction';
import './Home.css';

export default class Home extends Component{
    render(){
        return(
            <div className='container'>
                <h1 className='fontFCBold'> Chat Numerical Website</h1>
                <p> นี่คือเว็บไซด์สำหรับการคำนวณ Numerical Method สร้างขึ้นด้วย React , JSX , CSS. จัดทำโดยนายชาติชญานันท์ มรรคณา. </p>
                <p style = {{color: "red"}}> เป็นส่วนหนึ่งของรายวิชา 040613393 Numerical Methods. มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ  </p>
                <p className="bp"> &nbsp;</p>
                <Introduction/>
                <p> โดยรายละเอียดของวิธีการเหล่านี้ คุณสามารถเข้าไปเยี่ยมชมในแต่ละหน้าเพจ ผ่านปุ่มกดด้านบนได้เลย.</p>
            </div>
        );
    }
}