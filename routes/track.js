const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/track');
const auth = require('../middlewares/auth');
const { catchAsync } = require('../services/error');

router.get(
  '/tracks',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Tracks']
   * #swagger.summary = '取得追蹤名單'
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
      description: '取得追蹤名單成功',
      schema: [{ $ref: '#/definitions/Track' }]
    }
   */
    TrackController.getTracks
  )
);
router.post(
  '/track/:userId',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Tracks']
   * #swagger.summary = '追蹤特定的會員'
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
    #swagger.responses[201] = {
      description: '追蹤會員成功',
      schema: { data: '追蹤成功' }
    }
    #swagger.responses[400] = {
      description: '追蹤失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
    TrackController.postTrack
  )
);
router.delete(
  '/track/:userId',
  auth,
  catchAsync(
    /**
   * #swagger.tags = ['Tracks']
   * #swagger.summary = '取消追蹤特定的會員'
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
    #swagger.responses[201] = {
      description: '取消追蹤成功',
      schema: { data: '取消追蹤成功' }
    }
    #swagger.responses[400] = {
      description: '取消追蹤失敗',
      schema: { $ref: '#/definitions/Error' }
    }
   */
    TrackController.deleteTrack
  )
);

module.exports = router;
