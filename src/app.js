
require("dotenv").config();

const express = require('express');
const app = express();const cors = require("cors");
const favicon = require("express-favicon");
const logger = require("morgan");
const connectToDb = require("./db/connectToDb.js");

connectToDb();

const mainRouter = require("./routes/mainRouter.js");
const authRouter = require("./routes/authRouter.js");
const usersRoute = require("./routes/usersRoute.js");
const postRouter = require('./routes/postRouter.js');
const categoryRouter = require('./routes/categoryRouter.js');


// error handler
const notFoundMiddleware = require('./middlewares/not-found.js');
const errorHandlerMiddleware = require('./middlewares/error-handler.js');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter);
app.use("/api/auth", authRouter); 
app.use("/api/users", usersRoute); 
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/categories', categoryRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




module.exports = app;
