const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  const names = ['JsonWebTokenError', 'TokenExpiredError'];
  if (names.includes(err.name)) {
    const isExpired = err.name === 'TokenExpiredError';
    err.statusCode = 401;
    err.isOperational = true;
    err.message = isExpired ? errorMsg.tokenExpired : errorMsg.auth;
    return handleError(err, res);
  }
  next(err);
};
