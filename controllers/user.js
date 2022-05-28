const validator = require('validator');
const User = require('../models/user');
const Track = require('../models/track');
const { getHttpResponseContent } = require('../services/response');
const {
  appError,
  validationError,
  asyncHandleError,
} = require('../services/error');
const { getJWT } = require('../services/auth');
const {
  getEncryptedPassword,
  isValidPassword,
  isValidObjectId,
} = require('../services/validation');

const user = {
  // 取得會員資訊
  profile: asyncHandleError(async (req, res, next) => {
    res.status(200).json(getHttpResponseContent(req.user));
  }),
  // 取得特定的會員資訊
  getUserProfile: asyncHandleError(async (req, res, next) => {
    const {
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      return next(appError(400, '請傳入特定的會員'));

    const existedUser = await User.findById(userId);
    if (!existedUser) return next(appError(400, '尚未註冊為會員'));

    const tracking = await Track.find({ tracking: userId }).count();

    res
      .status(200)
      .json(getHttpResponseContent({ ...existedUser._doc, tracking }));
  }),
  // 驗證是否為有效的會員
  checkUser: asyncHandleError(async (req, res, next) => {
    const {
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      return next(appError(400, '請傳入特定的會員'));

    const existedUser = await User.findById(userId);
    if (!existedUser) return next(appError(400, '尚未註冊為會員'));

    res.status(200).json(getHttpResponseContent('OK'));
  }),
  // 註冊會員
  signUp: asyncHandleError(async (req, res, next) => {
    const {
      body: { name, email, password },
    } = req;

    if (!(name && email && password))
      return next(appError(400, '請填寫註冊資訊'));
    if (!validator.isLength(name, { min: 2 }))
      return next(validationError(400, 'name', '暱稱至少 2 個字元以上'));
    if (!validator.isEmail(email))
      return next(validationError(400, 'email', 'Email 格式不正確'));
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    )
      return next(
        validationError(400, 'password', '密碼需至少 8 碼以上，並英數混合')
      );

    const exist = await User.findOne({ email });
    if (exist)
      return next(
        validationError(400, 'email', '帳號已被註冊，請替換新的 Email！')
      );

    const hash = await getEncryptedPassword(password);
    const user = await User.create({ name, email, password: hash });

    res.status(201).json(getHttpResponseContent({ token: getJWT(user) }));
  }),
  // 登入會員
  signIn: asyncHandleError(async (req, res, next) => {
    const {
      body: { email, password },
    } = req;
    if (!(email && password)) return next(appError(400, '請填寫登入資訊'));
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(appError(400, '您尚未註冊會員'));

    const isValid = await isValidPassword(password, user.password);
    if (!isValid) return next(appError(400, '帳號或密碼錯誤，請重新輸入！'));

    res.status(201).json(getHttpResponseContent({ token: getJWT(user) }));
  }),
  // 更新會員資訊
  updateProfile: asyncHandleError(async (req, res, next) => {
    const {
      user,
      body: { name, gender, avatar },
    } = req;
    if (!(name && gender)) return next(appError(400, '請填寫修改資訊'));
    if (avatar && !validator.isURL(avatar, { protocols: ['https'] }))
      return next(validationError(400, 'avatar', '頭像路徑錯誤，請重新上傳'));
    if (!validator.isLength(name, { min: 2 }))
      return next(validationError(400, 'name', '暱稱至少 2 個字元以上'));
    if (!['male', 'female'].includes(gender))
      return next(validationError(400, 'gender', '性別需填寫男性或女性'));

    const payload = { name, gender };
    if (avatar) payload.avatar = avatar;
    const currentUser = await User.findByIdAndUpdate(user._id, payload);

    Object.assign(currentUser, { name, gender });
    if (avatar) currentUser.avatar = avatar;
    res.status(201).json(getHttpResponseContent(currentUser));
  }),
  // 更新會員密碼
  updatePassword: asyncHandleError(async (req, res, next) => {
    const {
      user,
      body: { password, confirm_password: confirmPassword },
    } = req;
    if (!(password && confirmPassword))
      return next(appError(400, '請填寫新密碼或確認密碼'));
    if (password !== confirmPassword)
      return next(appError(400, '新密碼和確認密碼不一致'));
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minSymbols: 0,
      })
    )
      return next(
        validationError(400, 'password', '密碼需至少 8 碼以上，並英數混合')
      );
    const hash = await getEncryptedPassword(password);
    await User.updateOne({ _id: user._id }, { password: hash });
    res.status(201).json(getHttpResponseContent('更新密碼成功'));
  }),
};

module.exports = user;
