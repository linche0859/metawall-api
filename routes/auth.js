const express = require('express');
const passport = require('passport');
const router = express.Router();
const AuthController = require('../controllers/auth');

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
  passport.authenticate('google', { session: false }),
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
  (req, res, next) => AuthController.google(req, res, next)
);

module.exports = router;
