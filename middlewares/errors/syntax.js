const { handleError } = require('../../services/error');
const { errorMsg, httpStatusCode } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === httpStatusCode.BAD_REQUEST &&
    'body' in err
  ) {
    err.statusCode = httpStatusCode.BAD_REQUEST;
    err.isOperational = true;
    err.isValidationError = true;
    err.message = errorMsg.SYNTAX;
    return handleError(err, res);
  }
  next(err);
};
