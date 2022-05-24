const express = require("express");

// Setup express server
const app = express();
const PORT = 3000;

// Import middleware into express
app.use(express.json({limit: "100mb"}));

//import routes
const authRouter = reuire("./route/auth");
const messgeRouter = reuire("./route/messge");

//Setup all the routes
app.use("/api/messge", messgeRouter);
app.use("./api/auth", authRouter);

//Start Server
app.listen(PORT, () => {
    console.log('listening on port ${PORT}...');
});

