const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const createMulter = require('../utils/multer');

// Create multer instance for testimonial images
const { upload: uploadTestimonial } = createMulter('testimonials');

// CRUD routes
router.post('/', uploadTestimonial.single('image'), testimonialController.createTestimonial);
router.get('/', testimonialController.getAllTestimonials);
router.get('/:id', testimonialController.getTestimonialById);
router.put('/:id', uploadTestimonial.single('image'), testimonialController.updateTestimonial);
router.delete('/:id', testimonialController.deleteTestimonial);

module.exports = router;
