const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
    err.isOperational = true;
    err.isValidationError = true;
    err.message = err.message || errorMsg.validation;
    return handleError(err, res);
  }
  next(err);
};
