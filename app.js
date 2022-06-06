const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./docs/swagger_output.json');
const fileErrorMiddleware = require('./middlewares/errors/file');
const jwtErrorMiddleware = require('./middlewares/errors/jwt');
const syntaxErrorMiddleware = require('./middlewares/errors/syntax');
const validationErrorMiddleware = require('./middlewares/errors/validation');
const errorMiddleware = require('./middlewares/errors/index');
const { AppError } = require('./services/error');
const { httpStatusCode } = require('./services/enum');

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
  next(new AppError(httpStatusCode.NOT_FOUND, '無此路由資訊'));
});

// error handler
app.use(fileErrorMiddleware);
app.use(jwtErrorMiddleware);
app.use(syntaxErrorMiddleware);
app.use(validationErrorMiddleware);
app.use(errorMiddleware);

module.exports = app;
