const page = {
  currentPage: 1,
  lastPage: 1,
  perPage: 10,
  total: 2,
};
const user = {
  _id: '123456789',
  name: '會員暱稱',
  avatar: 'https://i.imgur.com/xxx.png',
};

const Post = {
  content: '來新增一筆資料吧',
  image: 'https://i.imgur.com/xxx.png.',
  user,
  likes: ['123456789'],
  messages: [
    {
      _id: '123456789',
      user,
      content: '一則留言',
      createdAt: '2022-01-01T00:00:00.000Z',
    },
  ],
  createdAt: '2022-05-03T09:00:00.226Z',
};
const Posts = {
  data: [Post],
  meta: page,
};
const User = {
  ...user,
  gender: 'male',
};
const SpecificUser = {
  ...User,
  tracking: 0,
};
const Message = {
  _id: '123456789',
  user,
  content: '一則留言',
  createdAt: '2022-01-01T00:00:00.000Z',
};
const Track = {
  _id: '123456789',
  tracking: user,
  createdAt: '2022-01-01T00:00:00.000Z',
};
const Error = {
  message: {
    field: '錯誤訊息',
  },
};

module.exports = {
  Post,
  Posts,
  User,
  SpecificUser,
  Message,
  Track,
  Error,
};
