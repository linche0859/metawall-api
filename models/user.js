const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, '請填寫暱稱'],
    },
    email: {
      type: String,
      required: [true, '請填寫 Email'],
      unique: true,
      lowercase: true,
      select: false,
    },
    password: {
      type: String,
      required: [true, '請填寫密碼'],
      minlength: 8,
      select: false,
    },
    avatar: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'male',
      enum: ['male', 'female'],
    },
    googleId: {
      type: String,
      default: '',
      select: false,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model('User', schema);
