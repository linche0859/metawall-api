const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.statusCode = 400;
    err.message = errorMsg.fileLimit;
    err.isOperational = true;
    return handleError(err, res);
  }
  next(err);
};
