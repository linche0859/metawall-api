const { errorMsg } = require('../services/enum');

/**
 * 取得欄位驗證的錯誤
 * @param {object} err Error instance
 * @returns {object}
 */
const getValidationError = (err) => {
  if (typeof err.errors !== 'object') return err.message;
  return Object.entries(err.errors).reduce((acc, cur) => {
    const [field, value] = cur;
    acc[field] = value.message;
    return acc;
  }, {});
};

/**
 * 開發環境的錯誤處理
 * @param {object} err Error instance
 * @param {Object} res express response object
 */
const handleDevError = (err, res) => {
  const { statusCode, message, stack, isValidationError, toObject } = err;
  res.status(statusCode).json({
    message: isValidationError
      ? getValidationError(toObject ? JSON.parse(err.message) : err)
      : message,
    error: err,
    stack,
  });
};

/**
 * Production 環境的錯誤處理
 * @param {object} err Error instance
 * @param {Object} res express response object
 */
const handleProdError = (err, res) => {
  const { statusCode, message, isOperational, isValidationError, toObject } =
    err;
  if (isOperational) {
    return res.status(statusCode).json({
      message: isValidationError
        ? getValidationError(toObject ? JSON.parse(err.message) : err)
        : message,
    });
  }
  res.status(500).json({
    status: 'error',
    message: errorMsg.app,
  });
};

const handleError = (err, req, res, next) => {
  const isJsonWebTokenError = err.name === 'JsonWebTokenError';
  const isValidationError = err.name === 'ValidationError';
  const isSyntaxError =
    err instanceof SyntaxError && err.status === 400 && 'body' in err;
  err.statusCode = err.statusCode || 500;
  const isFileError = err.code === 'LIMIT_FILE_SIZE';

  // jwt error
  if (isJsonWebTokenError) {
    err.statusCode = 401;
    err.message = errorMsg.auth;
    err.isOperational = true;
  }
  // validation error
  else if (isValidationError || isSyntaxError) {
    err.statusCode = 400;
    err.message = isSyntaxError
      ? errorMsg.syntax
      : err.message || errorMsg.validation;
    err.isValidationError = true;
    err.isOperational = true;
  }
  // file error
  else if (isFileError) {
    err.statusCode = 400;
    err.message = errorMsg.fileLimit;
    err.isOperational = true;
  }
  if (process.env.NODE_ENV === 'development') {
    return handleDevError(err, res);
  }
  handleProdError(err, res);
};

module.exports = handleError;
