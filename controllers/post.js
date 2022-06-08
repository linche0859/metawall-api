const validator = require('validator');
const Post = require('../models/post');
const Message = require('../models/message');
const User = require('../models/user');
const { getHttpResponseContent } = require('../services/response');
const { AppError, ValidationError } = require('../services/error');
const {
  isValidObjectId,
  isPositiveInteger,
} = require('../services/validation');
const { httpStatusCode } = require('../services/enum');

const post = {
  // 取得貼文
  getPosts: async (req, res, next) => {
    let {
      query: { q, sort = 'desc', page = 1, limit = 10 },
    } = req;
    if (!isPositiveInteger(page))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁數');
    if (!isPositiveInteger(limit))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁筆數');

    page = parseInt(page);
    limit = parseInt(limit);
    const filter = q ? { content: new RegExp(q, 'i') } : {};
    const total = await Post.find(filter).count();
    const totalPage = Math.ceil(total / limit);
    if (totalPage > 0 && page > totalPage)
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁數');

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({
        path: 'messages',
        select: 'user content createdAt -post',
        options: { sort: { createdAt: -1 } },
      })
      .sort({
        createdAt: sort === 'desc' ? -1 : 1,
      });
    res.status(httpStatusCode.OK).json(
      getHttpResponseContent({
        data: posts,
        meta: {
          currentPage: page,
          lastPage: totalPage,
          perPage: limit,
          total,
        },
      })
    );
  },
  // 取得按讚的貼文
  getLikePosts: async (req, res, next) => {
    const { user } = req;
    const posts = await Post.find({ likes: { $in: user._id } })
      .populate({ path: 'user', select: 'name avatar' })
      .select('-messages')
      .sort({
        createdAt: -1,
      });
    res.status(httpStatusCode.OK).json(getHttpResponseContent(posts));
  },
  // 取得個人的貼文
  getUserPosts: async (req, res, next) => {
    let {
      params: { userId },
      query: { q, sort = 'desc', page = 1, limit = 10 },
    } = req;
    if (!(userId && isValidObjectId(userId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的會員');
    if (!isPositiveInteger(page))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁數');
    if (!isPositiveInteger(limit))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁筆數');

    const existedUser = await User.findById(userId);
    if (!existedUser)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未註冊為會員');

    page = parseInt(page);
    limit = parseInt(limit);

    const filter = { user: userId };
    if (q) filter.content = new RegExp(q, 'i');

    const total = await Post.find(filter).count();
    const totalPage = Math.ceil(total / limit);
    if (totalPage > 0 && page > totalPage)
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入正確的查詢頁數');

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({
        path: 'messages',
        select: 'user content createdAt -post',
        options: { sort: { createdAt: -1 } },
      })
      .sort({
        createdAt: sort === 'desc' ? -1 : 1,
      });
    res.status(httpStatusCode.OK).json(
      getHttpResponseContent({
        data: posts,
        meta: {
          currentPage: page,
          lastPage: totalPage,
          perPage: limit,
          total,
        },
      })
    );
  },
  // 取得特定的貼文
  getSpecificPost: async (req, res, next) => {
    const {
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');

    const existedPost = await Post.findById(postId)
      .populate({ path: 'user', select: 'name avatar' })
      .populate({
        path: 'messages',
        select: 'user content createdAt -post',
        options: { sort: { createdAt: -1 } },
      });
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');

    res.status(httpStatusCode.OK).json(getHttpResponseContent(existedPost));
  },
  // 驗證是否為有效的貼文
  checkPost: async (req, res, next) => {
    const {
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');

    const existedPost = await Post.findById(postId);
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');

    res.status(httpStatusCode.OK).json(getHttpResponseContent('OK'));
  },
  // 新增貼文
  postOnePost: async (req, res, next) => {
    const {
      user,
      body: { content, image },
    } = req;
    if (!content || validator.isEmpty(content, { ignore_whitespace: true }))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'content',
        '請填寫貼文內容'
      );
    if (image && !validator.isURL(image, { protocols: ['https'] }))
      throw new ValidationError(
        httpStatusCode.BAD_REQUEST,
        'image',
        '圖片路徑錯誤，請重新上傳'
      );

    const payload = { content, user: user._id };
    if (image) payload.image = image;
    const post = await Post.create(payload);
    post.messages = [];

    res.status(httpStatusCode.CREATED).json(getHttpResponseContent(post));
  },
  // 新增貼文留言
  postMessage: async (req, res, next) => {
    const {
      user,
      params: { postId },
      body: { content },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');
    if (!content || validator.isEmpty(content, { ignore_whitespace: true }))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請填寫留言內容');

    const existedPost = await Post.findById(postId);
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');

    const message = await Message.create({
      user: user._id,
      post: postId,
      content,
    });
    const currentMessage = await Message.findById(message._id);
    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent(currentMessage));
  },
  // 按讚貼文
  postLike: async (req, res, next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');

    const existedPost = await Post.findById(postId);
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');
    if (existedPost.likes.includes(user._id))
      throw new AppError(httpStatusCode.BAD_REQUEST, '已對該貼文按讚');

    await Post.updateOne(
      { _id: postId },
      {
        $addToSet: { likes: user._id },
      }
    );
    res
      .status(httpStatusCode.CREATED)
      .json(getHttpResponseContent('按讚貼文成功'));
  },
  // 刪除特定的貼文
  deletePost: async (req, res, next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');

    const existedPost = await Post.findById(postId);
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');
    if (existedPost.user.toString() !== user._id.toString())
      throw new AppError(httpStatusCode.BAD_REQUEST, '您無權限刪除此貼文');

    const postMessages = await Message.find({ post: postId });
    if (postMessages.length) {
      await Message.deleteMany({ post: postId });
    }
    await Post.deleteOne({ _id: postId });
    res.status(httpStatusCode.OK).json(getHttpResponseContent('刪除貼文成功'));
  },
  // 移除貼文的按讚
  deleteLike: async (req, res, next) => {
    const {
      user,
      params: { postId },
    } = req;
    if (!(postId && isValidObjectId(postId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的貼文');

    const existedPost = await Post.findById(postId);
    if (!existedPost)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未發布貼文');
    if (!existedPost.likes.includes(user._id))
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未按讚貼文');

    await Post.updateOne({ _id: postId }, { $pull: { likes: user._id } });
    res
      .status(httpStatusCode.OK)
      .json(getHttpResponseContent('移除貼文的按讚成功'));
  },
  // 刪除特定的留言
  deleteMessage: async (req, res, next) => {
    const {
      user,
      params: { messageId },
    } = req;
    if (!(messageId && isValidObjectId(messageId)))
      throw new AppError(httpStatusCode.BAD_REQUEST, '請傳入特定的留言');

    const existedMessage = await Message.findById(messageId);
    if (!existedMessage)
      throw new AppError(httpStatusCode.BAD_REQUEST, '尚未新增留言');
    if (existedMessage.user._id.toString() !== user._id.toString())
      throw new AppError(httpStatusCode.BAD_REQUEST, '您無權限刪除此留言');

    await Message.deleteOne({ _id: messageId });
    res.status(httpStatusCode.OK).json(getHttpResponseContent('刪除留言成功'));
  },
};

module.exports = post;
