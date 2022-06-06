const validator = require('validator');
const User = require('../models/user');
const Track = require('../models/track');
const { getHttpResponseContent } = require('../services/response');
const { AppError, ValidationError } = require('../services/error');
const { getJWT } = require('../services/auth');
const {
  getEncryptedPassword,
  isValidPassword,
  isValidObjectId,
} = require('../services/validation');
const { httpStatusCode } = require('../services/enum');

const user = {
  // 取得會員資訊
  profile: async (req, res, next) => {
    const { user } = req;
    const result = { ...user._doc };
    result.thirdAuth = !!(result.googleId || result.facebookId);
    delete result.googleId;
    delete result.facebookId;
    res.status(httpStatusCode.OK).json(getHttpResponseContent(result));
  },
  // 取得特定的會員資訊
  getUserProfile: async (req, res, next) => {
    const {
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的會員');

    const existedUser = await User.findById(userId);
    if (!existedUser)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未註冊為會員');

    const tracking = await Track.find({ tracking: userId }).count();

    res
      .status(httpStatusCode.OK)
      .json(getHttpResponseContent({ ...existedUser._doc, tracking }));
  },
  // 驗證是否為有效的會員
  checkUser: async (req, res, next) => {
    const {
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的會員');

    const existedUser = await User.findById(userId);
    if (!existedUser)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未註冊為會員');

    res.status(httpStatusCode.OK).json(getHttpResponseContent('OK'));
  },
  // 註冊會員
  signUp: async (req, res, next) => {
    const {
      body: { name, email, password },
    } = req;

    if (!(name && email && password))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請填寫註冊資訊');
    if (!validator.isLength(name, { min: 2 }))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'name',
        '暱稱至少 2 個字元以上'
      );
    if (!validator.isEmail(email))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'email',
        'Email 格式不正確'
      );
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    )
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'password',
        '密碼需至少 8 碼以上，並英數混合'
      );

    const exist = await User.findOne({ email });
    if (exist)
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'email',
        '帳號已被註冊，請替換新的 Email！'
      );

    const hash = await getEncryptedPassword(password);
    const user = await User.create({ name, email, password: hash });

    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent({ token: getJWT(user) }));
  },
  // 登入會員
  signIn: async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    if (!(email && password))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請填寫登入資訊');
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError(httpStatusCode.BAD_REQUEST, '您尚未註冊會員');

    const isValid = await isValidPassword(password, user.password);
    if (!isValid)
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        '帳號或密碼錯誤，請重新輸入！'
      );

    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent({ token: getJWT(user) }));
  },
  // 更新會員資訊
  updateProfile: async (req, res, next) => {
    const {
      user,
      body: { name, gender, avatar },
    } = req;
    if (!(name && gender))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請填寫修改資訊');
    if (avatar && !validator.isURL(avatar, { protocols: ['https'] }))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'avatar',
        '頭像路徑錯誤，請重新上傳'
      );
    if (!validator.isLength(name, { min: 2 }))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'name',
        '暱稱至少 2 個字元以上'
      );
    if (!['male', 'female'].includes(gender))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'gender',
        '性別需填寫男性或女性'
      );

    const payload = { name, gender };
    if (avatar) payload.avatar = avatar;
    const currentUser = await User.findByIdAndUpdate(user._id, payload);

    Object.assign(currentUser, { name, gender });
    if (avatar) currentUser.avatar = avatar;
    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent(currentUser));
  },
  // 更新會員密碼
  updatePassword: async (req, res, next) => {
    const {
      user,
      body: { password, confirm_password: confirmPassword },
    } = req;
    if (!(password && confirmPassword))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請填寫新密碼或確認密碼');
    if (password !== confirmPassword)
      throw new AppError(httpStatusCode.BAD_REQUEST, '新密碼和確認密碼不一致');
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    )
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'password',
        '密碼需至少 8 碼以上，並英數混合'
      );
    const hash = await getEncryptedPassword(password);
    await User.updateOne({ _id: user._id }, { password: hash });
    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent('更新密碼成功'));
  },
};

module.exports = user;
