const swaggerAutogen = require('swagger-autogen')();
require('dotenv').config();

const host =
  process.env.NODE_ENV === 'production'
    ? process.env.SWAGGER_BASE || 'localhost:3000'
    : 'localhost:3000';
const schemes = process.env.NODE_ENV === 'production' ? ['https'] : ['http'];
const definitions = require('./swagger-defintion');

const doc = {
  info: {
    title: 'METAWALL',
    description: 'METAWALL 的 API 文件',
  },
  host,
  schemes,
  tags: [
    { name: 'Posts', description: '貼文相關' },
    { name: 'Users', description: '會員相關' },
    { name: 'Tracks', description: '追蹤相關' },
    { name: 'Files', description: '上傳檔案相關' },
    { name: 'Auth', description: '第三方登入相關' },
  ],
  definitions,
  securityDefinitions: {
    apiKeyAuth: {
      type: 'apiKey',
      in: 'header', // can be 'header', 'query' or 'cookie'
      name: 'authorization', // name of the header, query parameter or cookie
      description: 'JSON Web Token',
    },
  },
};

const outputFile = './docs/swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API

swaggerAutogen(outputFile, endpointsFiles, doc);
