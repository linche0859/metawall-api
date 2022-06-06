const { httpStatusCode } = require('../services/enum');

/**
 * 取得系統的錯誤格式
 * @param {number} statusCode HTTP status code
 * @param {string} message 錯誤訊息
 * @param {boolean} isOperational 是否為可控制的錯誤
 * @param {string} stack error stack
 */
class AppError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 取得資料欄位錯誤的錯誤訊息
 * @param {number} httpStatus HTTP status code
 * @param {string} field 欄位
 * @param {string} message 錯誤訊息
 * @param {boolean} isOperational 是否為可控制的
 * @param {string} stack error stack
 */
class ValidationError extends Error {
  constructor(statusCode, field, message, isOperational = true, stack = '') {
    const result = { errors: {} };
    if (field) result.errors[field] = { message };
    super(JSON.stringify(result));
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.toObject = !!field; // 輸出成錯誤資訊時，需轉為物件
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * 非同步的錯誤處理
 * @param {function} func 非同步事件
 * @returns {function} 捕捉非同步錯誤的函式
 */
const catchAsync = (func) => (req, res, next) => {
  func(req, res, next).catch((error) => next(error));
};

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
 * 生產環境的錯誤處理
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
  res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: errorMsg.app,
  });
};

/**
 * 回傳錯誤處理
 * @param {object} err Error instance
 * @param {Object} res express response object
 */
const handleError = (err, res) => {
  if (process.env.NODE_ENV === 'development') {
    return handleDevError(err, res);
  }
  handleProdError(err, res);
};

module.exports = {
  AppError,
  ValidationError,
  catchAsync,
  handleError,
};
