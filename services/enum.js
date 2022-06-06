/**
 * 錯誤訊息的列舉
 */
const errorMsg = {
  APP: '系統錯誤，請聯絡系統管理員',
  AUTH: '您尚未登入',
  TOKEN_EXPIRED: '請重新登入',
  VALIDATION: '資料欄位未填寫正確，請重新輸入',
  SYNTAX: '資料格式錯誤，請重新輸入',
  FILE_LIMIT: '檔案大小僅限 2MB 以下',
};

/**
 * Http 狀態碼的列舉
 */
const httpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  errorMsg,
  httpStatusCode,
};
