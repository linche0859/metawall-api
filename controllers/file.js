const sizeOf = require('image-size');
const { getHttpResponseContent } = require('../services/response');
const { asyncHandleError, appError } = require('../services/error');
const { uploadImgur } = require('../services/upload');

const file = {
  // 上傳圖片
  postImage: asyncHandleError(async (req, res, next) => {
    const {
      file,
      query: { type },
    } = req;
    if (!file) return next(appError(400, '請選擇檔案'));
    if (type === 'avatar') {
      const dimensions = sizeOf(file.buffer);
      if (dimensions.width !== dimensions.height) {
        return next(appError(400, '圖片寬高比必需為 1:1，請重新輸入'));
      }
    }
    const link = await uploadImgur(file.buffer);
    res.status(201).json(getHttpResponseContent(link));
  }),
};

module.exports = file;
