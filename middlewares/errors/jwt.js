const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.message = errorMsg.auth;
    err.isOperational = true;
    return handleError(err, res);
  }
  next(err);
};
