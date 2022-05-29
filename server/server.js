const express = require("express");
const cors = require("cors");

//? Swagger
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// Setup the express server
const app = express();
const port = 4000;

// Import middlewares into express
app.use(express.json({ limit: "100mb" }));
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Chat Numerical Method API",
      version: "1.0.0"
    }
  },
  apis: ["server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

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

//? authRouter
/**
 * @swagger 
 * /api/auth:
 *   post:
 *     description: Get api token
 *     consumes:
 *       - application/json
 *     parameters:
 *     - in: body
 *       name: user
 *       schema: 
 *         type: object
 *         propeties: 
 *           email:
 *             type: string
 *           password:
 *             type: string
 *         example:
 *           email: vincent@vincentlab.net
 *           password: "123"
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

//? rootofequationRouter
/**
 * @swagger 
 * /api/rootofequation:
 *   get:
 *     description: Get Root Of Equation Example
 *     parameters:
 *        - in: header
 *          name: x-auth-token
 *          schema:
 *            type: string
 *            format: uuid
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

//? IntegrateAndDiffRouter
/**
 * @swagger 
 * /api/IntegrateAndDifferentiation:
 *   get:
 *     description: Get Integrate And Diffrerentiation Example
 *     parameters:
 *        - in: header
 *          name: x-auth-token
 *          schema:
 *            type: string
 *            format: uuid
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

//? LeastRegressRouter
/**
 * @swagger 
 * /api/Linear:
 *   get:
 *     description: Get LeastRegression Equation Example
 *     parameters:
 *        - in: header
 *          name: x-auth-token
 *          schema:
 *            type: string
 *            format: uuid
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

//? LinearAlgebraRouter
/**
 * @swagger 
 * /api/LinearAlgebra:
 *   get:
 *     description: Get LinearAlgebra Equation Example
 *     parameters:
 *        - in: header
 *          name: x-auth-token
 *          schema:
 *            type: string
 *            format: uuid
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

//? InterpolationRouter
/**
 * @swagger 
 * /api/Interpolation:
 *   get:
 *     description: Get Interpolation Equation Example
 *     parameters:
 *        - in: header
 *          name: x-auth-token
 *          schema:
 *            type: string
 *            format: uuid
 *            example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInZpZXdlciJdLCJpYXQiOjE2NTMwNjY0MzUsImV4cCI6MTY4NDYyNDAzNX0.pTeysLdrdUWa0hHVznTfMbtjoxz-a8Ae1IirCyWKqOc
 *     responses: 
 *       200: 
 *            description: get Example Success!
 */

// Start the server
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
