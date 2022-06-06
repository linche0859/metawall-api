const sizeOf = require('image-size');
const { getHttpResponseContent } = require('../services/response');
const { AppError } = require('../services/error');
const { uploadImgur } = require('../services/upload');
const { httpStatusCode } = require('../services/enum');

const file = {
  // 上傳圖片
  postImage: async (req, res, next) => {
    const {
      file,
      query: { type },
    } = req;
    if (!file) throw new AppError(httpStatusCode.BAD_REQUEST, '請選擇檔案');
    if (type === 'avatar') {
      const dimensions = sizeOf(file.buffer);
      if (dimensions.width !== dimensions.height) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          '圖片寬高比必需為 1:1，請重新輸入'
        );
      }
      if (dimensions.width < 300) {
        throw new AppError(
          httpStatusCode.BAD_REQUEST,
          '解析度寬度至少 300 像素以上，請重新輸入'
        );
      }
    }
    const link = await uploadImgur(file.buffer);
    res.status(httpStatusCode.CREATED).json(getHttpResponseContent(link));
  },
};

module.exports = file;
