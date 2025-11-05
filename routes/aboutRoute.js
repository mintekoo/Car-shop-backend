const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');

// CRUD routes
router.post('/', aboutController.createAbout);
router.get('/', aboutController.getAllAbouts);
router.get('/active', aboutController.getActiveAbout);
router.get('/:id', aboutController.getAboutById);
router.put('/:id', aboutController.updateAbout);
router.delete('/:id', aboutController.deleteAbout);

// Special routes
router.patch('/:id/toggle-activation', aboutController.toggleAboutActivation);


module.exports = router;