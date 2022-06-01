const { handleError } = require('../../services/error');
const { errorMsg } = require('../../services/enum');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || errorMsg.app;
  handleError(err, res);
};
