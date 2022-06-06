const { handleError } = require('../../services/error');
const { errorMsg, httpStatusCode } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR;
  err.message = err.message || errorMsg.APP;
  handleError(err, res);
};
