/**
 * 取得系統的錯誤格式
 * @param {number} httpStatus HTTP status code
 * @param {string} message 錯誤訊息
 * @param {string} name 錯誤名稱
 * @param {function} next express next function
 */
const appError = (httpStatus = 500, message = '') => {
  const error = new Error(message);
  error.statusCode = httpStatus;
  error.isOperational = true; // 可控的錯誤
  return error;
};

/**
 * 取得資料欄位錯誤的錯誤訊息
 * @param {number} httpStatus HTTP status code
 * @param {string} field 欄位
 * @param {string} message 錯誤訊息
 * @returns {object} Error instance
 */
const validationError = (httpStatus = 400, field, message) => {
  const result = { errors: {} };
  if (field) result.errors[field] = { message };

  const error = new Error(JSON.stringify(result));
  error.name = 'ValidationError';
  error.statusCode = httpStatus;
  error.toObject = true; // 輸出成錯誤資訊時，需轉為物件
  return error;
};

/**
 * 非同步的錯誤處理
 * @param {function} func 非同步事件
 */
const asyncHandleError = (func) => (req, res, next) => {
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
  res.status(500).json({
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
  appError,
  validationError,
  asyncHandleError,
  handleError,
};
