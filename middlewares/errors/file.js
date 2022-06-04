const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.statusCode = 400;
    err.isOperational = true;
    err.message = errorMsg.fileLimit;
    return handleError(err, res);
  }
  next(err);
};
