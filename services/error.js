/**
 * 取得錯誤欄位的回傳
 * @param {string} field 欄位
 * @param {string} message 錯誤訊息
 * @returns {string} json 格式的錯誤訊息
 */
const getValidationError = (field, message) => {
  const result = { errors: {} };
  if (field) result.errors[field] = { message };
  return JSON.stringify(result);
};

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
  const error = new Error(getValidationError(field, message));
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

module.exports = {
  appError,
  validationError,
  asyncHandleError,
};
