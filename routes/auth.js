const jwt = require('jsonwebtoken');
const express = require("express");
const bcrypt = require('bcrypt');

const router = express.router();

router.post("/" , async (req, res) => {
    //? ข้อมูลจำลอง (ฐานข้อมูลจำลอง)
    const users = [
      {
        name: "chatchayanan",
        password: "superchat01",
        roles: ["admin", "editor", "viwer"],
      },
    ];

    //TODO: เอาข้อมูลผู้ใช้มาเช็คจากฐานข้อมูล ถ้าข้อมูลไม่มี ให้คืนค่า Error

    let user = users.find(u => u.name === req.body.name);
    if (!user) throw new Error("Invalid name or password.");

    //TODO: เทียบรหัสผ่าน กับรหัสผ่านในฐาข้อมูล
    const valid = await bcrypt.compare(req.body.password, user.password)
    if (!valid) throw new Error("Invalid name or password.");

    const token = jwt.sign({
        id:user.id,
        roles: user.roles,
    }, "jwtPrivateKey", { expiresIn: "15m" });

    res.send({
        ok: true,
        token: token
    });

});

module.exports = router;