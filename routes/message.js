const express = require("express");

const auth = require("../middleware/auth");
const { admin, editor, viewer } = require("../middleware/roles");

//? ข้อมูลจำลอง (ฐานข้อมูลจำลอง)
let messages = [{ id: 1, name: "Lorem ipsum dolor", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras pretium nec ipsum nec elementum." }];

//? router for express
const router = express.Router();

// *************************
//TODO the route handlers (ตัวจัดการ Route)
// *************************

router.get("/", [auth, viewer], (req, res) => {
    res.send({
        ok: true,
        result: messages
    });
});

router.post("/", [auth, editor], async (req, res) => {
    // สร้าง message and และเพิ่มลงฐานข้อมูล
    messages.push({ id: messages.length + 1, name: req.body.name, content: req.body.content });

    // ส่ง response
    res.status(200).send({
        ok: true,
        result: messages
    });
});

router.put("/", [auth, editor], async (req, res) => {
    // Update the message
    //! ไม่ได้ทำโค้ดส่วนนี้
    // Send response
    res.status(200).send({
        ok: true,
        result: messages
    });
});

router.delete("/", [auth, admin], async (req, res) => {
    // Delete the message
    messages = messages.filter((message) => { message.id !== req.body.id });

    // Send response
    res.status(200).send({
        ok: true,
        result: messages
    });
});

// Export the router
module.exports = router;