const Track = require('../models/track');
const User = require('../models/user');
const { getHttpResponseContent } = require('../services/response');
const { AppError } = require('../services/error');
const { isValidObjectId } = require('../services/validation');
const { httpStatusCode } = require('../services/enum');

const track = {
  // 取得追蹤名單
  getTracks: async (req, res, next) => {
    const { user } = req;
    const tracks = await Track.find({ user: user._id })
      .select('-user')
      .populate({ path: 'tracking', select: 'name avatar' })
      .sort({
        createdAt: -1,
      });
    res.status(httpStatusCode.OK).json(getHttpResponseContent(tracks));
  },
  // 追蹤特定的會員
  postTrack: async (req, res, next) => {
    const {
      user,
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的追蹤會員');
    if (userId === user._id.toString())
      throw new AppError(httpStatusCode.BAD_REQUEST, '無法追蹤自己');

    const existedUser = await User.findById(userId);
    if (!existedUser)
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        '追蹤的會員尚未註冊為會員'
      );

    const existedTracking = await Track.findOne({
      user: user._id,
      tracking: userId,
    });
    if (existedTracking)
      throw new AppError(httpStatusCode.BAD_REQUEST, '已追蹤該會員');

    await Track.create({ user: user._id, tracking: userId });
    res.status(httpStatusCode.CREATED).json(getHttpResponseContent('追蹤成功'));
  },
  // 取消追蹤特定的會員
  deleteTrack: async (req, res, next) => {
    const {
      user,
      params: { userId },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的追蹤會員');

    const existedUser = await User.findById(userId);
    if (!existedUser)
      throw new AppError(
        httpStatusCode.BAD_REQUEST,
        '追蹤的會員尚未註冊為會員'
      );

    const existedTracking = await Track.findOne({
      user: user._id,
      tracking: userId,
    });
    if (!existedTracking)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未追蹤該會員');

    await Track.deleteOne({ user: user._id, tracking: userId });
    res.status(httpStatusCode.OK).json(getHttpResponseContent('取消追蹤成功'));
  },
};

module.exports = track;
