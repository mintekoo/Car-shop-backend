const express = require('express');
const router = express.Router();
const translationController = require('../controllers/translationController');

// CRUD routes
router.post('/', translationController.createTranslation);
router.get('/', translationController.getAllTranslations);
router.get('/:id', translationController.getTranslationById);
router.put('/:id', translationController.updateTranslation);
router.delete('/:id', translationController.deleteTranslation);

module.exports = router;