const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const createMulter = require('../utils/multer');

// Multer instance for blog images
const { upload: uploadBlog } = createMulter('blogs');

// CRUD routes
router.post('/', uploadBlog.single('image'), blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', uploadBlog.single('image'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

// // Relation routes
// router.get('/published', blogController.getPublishedBlogs);
// router.get('/author/:authorId', blogController.getBlogsByAuthor);
// router.get('/category/:categoryId', blogController.getBlogsByCategory);

// // Special routes
// router.patch('/:id/toggle-publish', blogController.togglePublishStatus);

module.exports = router;