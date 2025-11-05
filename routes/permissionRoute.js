const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

// CRUD routes
router.post('/', permissionController.createPermission);
router.get('/', permissionController.getAllPermissions);
router.get('/:id', permissionController.getPermissionById);
router.delete('/:id', permissionController.deletePermission);

module.exports = router;