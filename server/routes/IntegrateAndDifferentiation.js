// Import dependencies
const express = require("express");
const db = require("../config");

// Import middlewares
const auth = require("../middleware/auth");
const { admin, editor, viewer } = require("../middleware/roles");

// Setup  router สำหรับ express
const router = express.Router();

// *************************
// Set up the route handlers (ตัวจัดการ route)
// *************************

router.get("/", [auth, viewer], async (req, res) => {
    
  const snapshot = await db.collection("IntegrateAndDifferentiation").get();

  var data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  res.send({
    ok: true,
    result: data,
  });
});

// Export the router
module.exports = router;