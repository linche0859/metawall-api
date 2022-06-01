const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.message = err.message || errorMsg.validation;
    err.isValidationError = true;
    err.isOperational = true;
    return handleError(err, res);
  }
  next(err);
};
