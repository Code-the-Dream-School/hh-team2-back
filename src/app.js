
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const connectToDb = require("./db/connectToDb.js");

connectToDb();

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authRouter.js");
const usersRoute = require("./routes/usersRoute.js");



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(express.static("public"));
app.use(favicon(__dirname + "/public/favicon.ico"));

// Routes
app.use("/api/v1", mainRouter);
app.use("/api/auth", authRouter); 
app.use("/api/users", usersRoute); 

// const start = async () => {
//     try {
//       // connectDB
//       await connectToDb(process.env.MONGO_URI);
//       console.log("Connecting to MongoDB...");
//     } catch (error) {
//       console.log(error);
//     }
//   };
  
//   start();

module.exports = app;
