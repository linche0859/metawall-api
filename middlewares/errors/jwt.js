const { handleError } = require('../../services/error');
const { errorMsg, httpStatusCode } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  const names = ['JsonWebTokenError', 'TokenExpiredError'];
  if (names.includes(err.name)) {
    const isExpired = err.name === 'TokenExpiredError';
    err.statusCode = httpStatusCode.UNAUTHORIZED;
    err.isOperational = true;
    err.message = isExpired ? errorMsg.TOKEN_EXPIRED : errorMsg.AUTH;
    return handleError(err, res);
  }
  next(err);
};
