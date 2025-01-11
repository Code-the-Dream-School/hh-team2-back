require('dotenv').config();

const express = require('express');
const app = express();

// swaggger api-documentation
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const cors = require('cors');
const favicon = require('express-favicon');
const logger = require('morgan');

const connectToDb = require('./db/connectToDb.js');

connectToDb();

const mainRouter = require('./routes/mainRouter.js');
const authRouter = require('./routes/authRouter.js');
const usersRoute = require('./routes/usersRouter.js');
const postRouter = require('./routes/postRouter.js');
const categoryRouter = require('./routes/categoryRouter.js');

const groupRouter = require('./routes/groupRouter.js');

const reactionRouter = require('./routes/reactionRouter.js');

const commentRouter = require('./routes/commentRouter.js')

const messageRouter = require('./routes/messageRouter.js');

// error handler
const notFoundMiddleware = require('./middlewares/not-found.js');
const errorHandlerMiddleware = require('./middlewares/error-handler.js');

// Middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API documentation for the CTD blog application.',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Specify JWT format
        },
      },
      schemas: {
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64db4d394a9a7a00125f2c1b',
            },
            title: {
              type: 'string',
              example: 'My First Blog Post',
            },
            content: {
              type: 'string',
              example: 'This is the content of the blog post.',
            },
            author: {
              type: 'string',
              example: '64db4d394a9a7a00125f2c1b',
            },
            imageUrl: {
              type: 'string',
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00.000Z',
            },
            status: {
              type: 'string',
              example: 'Draft',
            },
          },
        },
        Message:{
          type: 'object',
          properties:{
            _id:{
              type: 'string',
              example: '64db4d394a9a7a00125f2c1b',
            },
            sender: {
              type: 'string',
              example: '64db4d394a9a7a00125f2c1b',
            },
            receiver: {
              type: 'string',
              example: '64db4d394a9a7a00125f2c1b',
            },
            content:{
              type: 'string',
              example: 'Hello!',
            },
            emojis:{
              type: 'array',
              items: {
                type: 'object',
                properties:{
                  emoji:{
                    type: 'string',
                    example: '😀',
                  },
                  userId: {
                    type: 'string',
                    example: '64db4d394a9a7a00125f2c1b',
                  },
                },
              },
            },
            status: {
              type: 'string',
              example: 'unread',
            },
          },
        },
      },
    },
  },
  apis: ['src/routes/*.js'], // Path to the routes files
};

// Initialize Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// cors
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
// routes
app.use('/api/v1', mainRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRoute);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/categories', categoryRouter);

app.use('/api/v1/groups', groupRouter);

app.use('/api/v1/reactions', reactionRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/messages', messageRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
