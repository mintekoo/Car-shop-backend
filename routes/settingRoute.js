const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// CRUD routes
router.post('/', settingController.createSetting);
router.get('/', settingController.getAllSettings);
router.get('/:id', settingController.getSettingById);
router.put('/:id', settingController.updateSetting);
router.delete('/:id', settingController.deleteSetting);

module.exports = router;