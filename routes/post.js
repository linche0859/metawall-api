const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');
const auth = require('../middlewares/auth');
const { catchAsync } = require('../services/error');

router.get(
  '/posts',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['q'] = {
      in: 'query',
      description: '關鍵字',
      type: 'string',
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: '排序方式，desc 為新至舊，asc 為舊至新',
      type: 'string',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: '頁碼',
      type: 'string',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: '頁筆數',
      type: 'string',
    }
   */
    /**
    #swagger.responses[200] = {
      description: '取得貼文成功',
      schema: { $ref: '#/definitions/Posts' }
    }
   */
    PostController.getPosts
  )
);
router.get(
  '/posts/like',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得按讚的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
   */
    /**
    #swagger.responses[200] = {
      description: '取得按讚的貼文成功',
      schema: [{ $ref: '#/definitions/Post' }]
    }
   */
    PostController.getLikePosts
  )
);
router.get(
  '/posts/:userId/user',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得個人的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['userId'] = { 
      description: '會員編號',
    }
    #swagger.parameters['q'] = {
      in: 'query',
      description: '關鍵字',
      type: 'string',
    }
    #swagger.parameters['sort'] = {
      in: 'query',
      description: '排序方式，desc 為新至舊，asc 為舊至新',
      type: 'string',
    }
    #swagger.parameters['page'] = {
      in: 'query',
      description: '頁碼',
      type: 'string',
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      description: '頁筆數',
      type: 'string',
    }
   */
    /**
    #swagger.responses[200] = {
      description: '取得個人的貼文成功',
      schema: { $ref: '#/definitions/Posts' }
    }
   */
    PostController.getUserPosts
  )
);
router.get(
  '/post/:postId',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '取得特定的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
   */
    /**
    #swagger.responses[200] = {
      description: '取得特定的貼文成功',
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[400] = {
      description: '取得特定的貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
    PostController.getSpecificPost
  )
);
router.get(
  '/post/:postId/check',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '驗證是否為有效的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
   */
    /**
    #swagger.responses[200] = {
      description: '驗證成功',
      schema: 'OK'
    }
    #swagger.responses[400] = {
      description: '驗證失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
    PostController.checkPost
  )
);
router.post(
  '/post',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '貼文資料',
      schema: {
        $content: '貼文內容',
        image: '貼文圖片連結'
      }
    }
  */
    /**
    #swagger.responses[201] = {
      description: '新增貼文成功',
      schema: { $ref: '#/definitions/Post' }
    }
    #swagger.responses[400] = {
      description: '新增貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.postOnePost
  )
);
router.post(
  '/post/:postId/message',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '新增貼文留言'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '留言資料',
      schema: {
        $content: '貼文內容',
      }
    }
  */
    /**
    #swagger.responses[201] = {
      description: '新增貼文留言成功',
      schema: { $ref: '#/definitions/Message' }
    }
    #swagger.responses[400] = {
      description: '新增貼文留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.postMessage
  )
);
router.post(
  '/post/:postId/like',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '按讚貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
  */
    /**
    #swagger.responses[201] = {
      description: '按讚貼文成功',
      schema: { data: '按讚貼文成功' }
    }
    #swagger.responses[400] = {
      description: '按讚貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.postLike
  )
);
router.delete(
  '/post/:postId',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除特定的貼文'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
  */
    /**
    #swagger.responses[201] = {
      description: '刪除貼文成功',
      schema: {
        data: '刪除貼文成功'
      }
    }
    #swagger.responses[400] = {
      description: '刪除貼文失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.deletePost
  )
);
router.delete(
  '/post/:postId/like',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '移除貼文的按讚'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['postId'] = { 
      description: '貼文編號',
    }
  */
    /**
    #swagger.responses[201] = {
      description: '移除貼文的按讚成功',
      schema: {
        data: '移除貼文的按讚成功'
      }
    }
    #swagger.responses[400] = {
      description: '移除貼文的按讚失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.deleteLike
  )
);
router.delete(
  '/post/:messageId/message',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Posts']
   * #swagger.summary = '刪除特定的留言'
   * #swagger.security = [{
      "apiKeyAuth": [] 
    }]
   */
    /**
    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'JSON Web Token',
      schema: {
        $Authorization: '',
      }
    }
    #swagger.parameters['messageId'] = { 
      description: '留言編號',
    }
  */
    /**
    #swagger.responses[201] = {
      description: '刪除留言成功',
      schema: {
        data: '刪除留言成功'
      }
    }
    #swagger.responses[400] = {
      description: '刪除留言失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
    PostController.deleteMessage
  )
);

module.exports = router;
