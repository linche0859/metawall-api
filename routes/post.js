const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post');
const auth = require('../middlewares/auth');

router.get('/posts', auth, (req, res, next) =>
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
  PostController.getPosts(req, res, next)
);
router.get('/posts/like', auth, (req, res, next) =>
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
  PostController.getLikePosts(req, res, next)
);
router.get('/posts/:userId/user', auth, (req, res, next) =>
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
  PostController.getUserPosts(req, res, next)
);
router.get('/post/:postId', auth, (req, res, next) =>
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
  PostController.getSpecificPost(req, res, next)
);
router.get('/post/:postId/check', auth, (req, res, next) =>
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
  PostController.checkPost(req, res, next)
);
router.post('/post', auth, (req, res, next) =>
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
  PostController.postOnePost(req, res, next)
);
router.post('/post/:postId/message', auth, (req, res, next) =>
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
  PostController.postMessage(req, res, next)
);
router.post('/post/:postId/like', auth, (req, res, next) =>
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
  PostController.postLike(req, res, next)
);
router.delete('/post/:postId', auth, (req, res, next) =>
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
  PostController.deletePost(req, res, next)
);
router.delete('/post/:postId/like', auth, (req, res, next) =>
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
  PostController.deleteLike(req, res, next)
);
router.delete('/post/:messageId/message', auth, (req, res, next) =>
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
  PostController.deleteMessage(req, res, next)
);

module.exports = router;
