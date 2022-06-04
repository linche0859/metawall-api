const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, '請填寫留言者'],
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, '請填寫特定的貼文'],
      select: false,
    },
    content: {
      type: String,
      required: [true, '請填寫留言內容'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }
);
schema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar',
  });
  next();
});

module.exports = mongoose.model('Message', schema);
