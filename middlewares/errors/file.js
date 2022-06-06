const { handleError } = require('../../services/error');
const { errorMsg, httpStatusCode } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.statusCode = httpStatusCode.BAD_REQUEST;
    err.isOperational = true;
    err.message = errorMsg.FILE_LIMIT;
    return handleError(err, res);
  }
  next(err);
};
