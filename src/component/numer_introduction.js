import './introduct.css';
const Introduction = () =>{
    return(
        <>
            <h1 style={{marginTop: 50}}> Numerical Method คืออะไร?</h1>
            <p> ก่อนที่เราจะไปคำนวณ Numerical Method. เราก็ควรจะรู้ว่า Numerical Method คืออะไรเสียก่อนเพื่อความเข้าใจที่ตรงกัน.</p>
            <p> 
                หากจะให้สรุปสั้นๆได้ใจความที่สุด Numerical Method คือ วิธีการทางคอมพิวเตอร์และโปรแกรม ในการช่วยคาดเดาค่าคำตอบ
                ของสมการสมการหนึ่ง แทนที่มนุษย์จะทำการคำนวณด้วยตัวเอง ซึ่งจะมีปัญหาในด้านของเวลาที่ช้า และมีโอกาสผิดพลาดได้มากกว่า.
            </p>
            <dd>
                <p style = {{fontWeight: 'Bold' , textDecoration : "underline"}}> ตัวอย่างวิธีการ Numerical Method </p>
                <ul>
                    <li> Root of Equation </li>
                    <li> Linear Algebraic Equation </li>
                    <li> Interpolation and Regression </li>
                    <li> Least-squares Regression </li>
                    <li> Integration and Differention </li>
                </ul>
            </dd>
        </>
    );
}

export default Introduction