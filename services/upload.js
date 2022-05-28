const { ImgurClient } = require('imgur');

/**
 * 上傳圖片至 imgur
 * @param {buffer} buffer
 * @returns {promise} imgur url
 */
const uploadImgur = async (buffer) => {
  const client = new ImgurClient({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  });
  const response = await client.upload({
    image: buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID,
  });
  return response.data.link;
};

module.exports = {
  uploadImgur,
};
