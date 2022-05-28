const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./docs/swagger_output.json');
const { appError } = require('./services/error');
const errorMiddleware = require('./middlewares/handle-error');

require('dotenv').config();
require('./connections/mongoose');
require('./connections/passport');
require('./services/process');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const trackRouter = require('./routes/track');
const fileRouter = require('./routes/file');
const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  cors({
    allowedHeaders:
      'Content-Type,Authorization,Content-Length,X-Requested-With',
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(userRouter);
app.use(postRouter);
app.use(trackRouter);
app.use(fileRouter);
app.use(authRouter);
app.use(`/api/doc`, swaggerUi.serve, swaggerUi.setup(swaggerFile));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(appError(404, '無此路由資訊'));
});

// error handler
app.use(errorMiddleware);

// 捕捉

module.exports = app;
