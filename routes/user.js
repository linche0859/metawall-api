const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.get('/user/profile', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得會員資訊'
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
      description: '取得會員資訊成功',
      schema: { $ref: '#/definitions/User' }
    }
    #swagger.responses[401] = {
      description: '登入會員失敗',
      schema: {
        message: '您尚未登入'
      }
    }
  */
  UserController.profile(req, res, next)
);
router.get('/user/:userId/profile', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '取得特定的會員資訊'
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
   */
  /**
    #swagger.responses[200] = {
      description: '取得會員資訊成功',
      schema: { $ref: '#/definitions/SpecificUser' }
    }
    #swagger.responses[400] = {
      description: '登入會員失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.getUserProfile(req, res, next)
);
router.get('/user/:userId/check', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '驗證是否為有效的會員'
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
  UserController.checkUser(req, res, next)
);
router.post('/user/sign_up', (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '註冊會員'
   */
  /**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '註冊資料',
      schema: {
        $name: '暱稱',
        $email: 'test@gmail.com',
        $password: 'a1234567',
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '註冊會員成功',
      schema: {
        token: 'token',
      }
    }
    #swagger.responses[400] = {
      description: '註冊會員失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.signUp(req, res, next)
);
router.post('/user/sign_in', (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '登入會員'
   */
  /**
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '登入資料',
      schema: {
        $email: 'test@gmail.com',
        $password: 'a1234567',
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '登入會員成功',
      schema: {
        token: 'token',
      }
    }
    #swagger.responses[400] = {
      description: '登入會員失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.signIn(req, res, next)
);
router.patch('/user/profile', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '更新會員資訊'
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
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '更新資料',
      schema: {
        $name: '兩金勘吉',
        $gender: 'female',
        avatar: 'https://i.imgur.com/xxx.png'
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '更新會員資訊成功',
      schema: { $ref: '#/definitions/User' }
    }
    #swagger.responses[400] = {
      description: '更新會員資訊失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.updateProfile(req, res, next)
);
router.patch('/user/password', auth, (req, res, next) =>
  /**
   * #swagger.tags = ['Users']
   * #swagger.summary = '更新會員密碼'
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
    #swagger.parameters['parameter_name'] = {
      in: 'body',
      description: '更新資料',
      schema: {
        $password: 'a1234567',
        $confirm_password: 'a1234567',
      }
    }
   */
  /**
    #swagger.responses[201] = {
      description: '更新會員密碼成功',
      schema: {
        data: '更新密碼成功'
      }
    }
    #swagger.responses[400] = {
      description: '更新會員密碼失敗',
      schema: { $ref: '#/definitions/Error' }
    }
  */
  UserController.updatePassword(req, res, next)
);

module.exports = router;
