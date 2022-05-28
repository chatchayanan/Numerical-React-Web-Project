const express = require("express");
const cors = require("cors");
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUI = require("swagger-ui-express");

// Setup the express server
const app = express();
const port = 4000;

// Import middlewares into express
app.use(express.json({ limit: "100mb" }));
app.use(cors());

/*
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Chat Numerical Method Project API",
      version: "1.0.0"
    }
  },
  apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));*/

// Import routes
const authRouter = require("./routes/auth");
const messagesRouter = require("./routes/messages");
const rootofequationRouter = require("./routes/RootOfEquation");
const LeastRegressRouter = require("./routes/Linear");  //? เขียนชื่อ DataBase ผิด
const LinearAlgebraRouter = require("./routes/LinearAlgebra");
const IntegrateAndDiffRouter = require("./routes/IntegrateAndDifferentiation");
const InterpolationRouter = require("./routes/Interpolation"); 

// Setup all the routes
app.use("/api/messages", messagesRouter);
app.use("/api/auth", authRouter);

app.use("/api/rootofequation", rootofequationRouter);
app.use("/api/LinearAlgebra", LinearAlgebraRouter);
app.use("/api/Linear" , LeastRegressRouter);
app.use("/api/Interpolation" , InterpolationRouter);
app.use("/api/IntegrateAndDifferentiation" , IntegrateAndDiffRouter);

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
