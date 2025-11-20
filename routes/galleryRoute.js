const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const createMulter = require('../utils/multer');

// Multer instance for gallery images
const { upload: uploadGallery } = createMulter('gallery');
// CRUD routes
router.post('/', uploadGallery.array('images', 5), galleryController.createGallery);
router.get('/', galleryController.getAllGalleries);
router.get('/:id', galleryController.getGalleryById);
router.put('/:id', uploadGallery.array('images', 5), galleryController.updateGallery);
router.delete('/:id', galleryController.deleteGallery);

module.exports = router;