const mongoose = require('mongoose');

const dbUrl = process.env.MONGODB_URL.replace(
  '<password>',
  process.env.MONGODB_PASSWORD
);
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('資料庫連線成功');
  })
  .catch((e) => {
    console.log(e.reason);
  });
