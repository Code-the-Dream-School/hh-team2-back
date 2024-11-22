require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');

const mainRouter = require('./routes/mainRouter.js');
const postRouter = require('./routes/postRouter.js');
const categoryRouter = require('./routes/categoryRouter.js');

const connectDB = require('./db/connect.js');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/categories', categoryRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connect to DB

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    console.log('Connecting to MongoDB...');
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = app;
