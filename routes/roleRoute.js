const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// CRUD routes
router.post('/', roleController.createRole);
router.get('/', roleController.getAllRoles);
router.get('/:id', roleController.getRoleById);
router.delete('/:id', roleController.deleteRole);

module.exports = router;