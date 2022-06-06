const multer = require('multer');
const { AppError } = require('../services/error');
const { httpStatusCode } = require('../services/enum');

const fileSize = 2 * 1024 * 1024;
const upload = multer({
  limits: {
    fileSize,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(
        new AppError(
          httpStatusCode.BAD_REQUEST,
          '檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式'
        )
      );
    }
    cb(null, true);
  },
});

module.exports = upload;
