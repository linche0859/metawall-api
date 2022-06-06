const User = require('../models/user');
const { AppError, catchAsync } = require('../services/error');
const { getDecryptedJWT } = require('../services/auth');
const { errorMsg, httpStatusCode } = require('../services/enum');

const auth = catchAsync(async (req, res, next) => {
  const {
    headers: { authorization = '' },
  } = req;
  let token = '';
  if (authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError(httpStatusCode.UNAUTHORIZED, errorMsg.AUTH);
  }
  const decryptedData = getDecryptedJWT(token);
  if (!decryptedData)
    throw new AppError(httpStatusCode.UNAUTHORIZED, errorMsg.AUTH);

  const user = await User.findById(decryptedData.id).select(
    '+googleId +facebookId'
  );
  if (!user) throw new AppError(httpStatusCode.UNAUTHORIZED, errorMsg.AUTH);

  req.user = user;
  next();
});

module.exports = auth;
