const express = require('express');
const passport = require('passport');
const router = express.Router();
const AuthController = require('../controllers/auth');
const { catchAsync } = require('../services/error');

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = 'Google 帳號登入'
   */
  /**
    #swagger.responses[302] = {
      description: '導頁成功',
      schema: '導頁至 Google 登入頁面',
    }
    #swagger.responses[500] = {
      description: '導頁失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.APP_URL}/login`,
  }),
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '已授權的 Google 帳號導向'
   */
  /**
    #swagger.responses[302] = {
      description: '導向成功',
      schema: '導頁至前台位置',
    }
    #swagger.responses[500] = {
      description: '導向失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  catchAsync(AuthController.google)
);
router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = 'Facebook 帳號登入'
   */
  /**
    #swagger.responses[302] = {
      description: '導頁成功',
      schema: '導頁至 Facebook 登入頁面',
    }
    #swagger.responses[500] = {
      description: '導頁失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${process.env.APP_URL}/login`,
  }),
  /**
   * #swagger.tags = ['Auth']
   * #swagger.summary = '已授權的 Facebook 帳號導向'
   */
  /**
    #swagger.responses[302] = {
      description: '導向成功',
      schema: '導頁至前台位置',
    }
    #swagger.responses[500] = {
      description: '導向失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
  catchAsync(AuthController.facebook)
);

module.exports = router;
