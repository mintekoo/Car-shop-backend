const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const createMulter = require('../utils/multer');
const { upload: uploadCategory } = createMulter('categories');

// CRUD routes
router.post('/', uploadCategory.single('image'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', uploadCategory.single('image'), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;