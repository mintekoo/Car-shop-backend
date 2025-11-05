const express = require('express');
const router = express.Router();
const termAndConditionController = require('../controllers/termAndConditionController');

// CRUD routes
router.post('/', termAndConditionController.createTermAndCondition);
router.get('/', termAndConditionController.getAllTermsAndConditions);
router.get('/:id', termAndConditionController.getTermAndConditionById);
router.put('/:id', termAndConditionController.updateTermAndCondition);
router.delete('/:id', termAndConditionController.deleteTermAndCondition);

module.exports = router;