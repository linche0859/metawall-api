const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    err.statusCode = 400;
    err.isOperational = true;
    err.isValidationError = true;
    err.message = errorMsg.syntax;
    return handleError(err, res);
  }
  next(err);
};
