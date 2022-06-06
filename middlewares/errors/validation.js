const { handleError } = require('../../services/error');
const { errorMsg, httpStatusCode } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.statusCode = httpStatusCode.BAD_REQUEST;
    err.isOperational = true;
    err.isValidationError = true;
    err.message = err.message || errorMsg.VALIDATION;
    return handleError(err, res);
  }
  next(err);
};
