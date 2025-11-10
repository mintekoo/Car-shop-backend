const express = require('express');
const router = express.Router();


// Import all route files
const userRoutes = require('./userRoute');
const productRoutes = require('./productRoute');
const bookingRoutes = require('./bookingRoute');
const categoryRoutes = require('./categoryRoute');
const aboutRoutes = require('./aboutRoute');
const blogRoutes = require('./blogRoute');
const clientRoutes = require('./clientRoute');
const contactRoutes = require('./contactRoute');
const faqRoutes = require('./faqRoute');
const galleryRoutes = require('./galleryRoute');
const locationRoutes = require('./locationRoute');
const partnerRoutes = require('./partnerRoute');
const permissionRoutes = require('./permissionRoute');
const roleRoutes = require('./roleRoute');
const serviceRoutes = require('./serviceRoute');
const settingRoutes = require('./settingRoute');
const sliderRoutes = require('./sliderRoute');
const termAndConditionRoutes = require('./termAndConditionRoute');
const testimonialRoutes = require('./testimonialRoute');
const translationRoutes = require('./translationRoute');
const dashboardRoutes = require('./dashboardRoute');

// Use routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/bookings', bookingRoutes);
router.use('/categories', categoryRoutes);
router.use('/about', aboutRoutes);
router.use('/blogs', blogRoutes);
router.use('/clients', clientRoutes);
router.use('/contacts', contactRoutes);
router.use('/faqs', faqRoutes);
router.use('/galleries', galleryRoutes);
router.use('/locations', locationRoutes);
router.use('/partners', partnerRoutes);
router.use('/permissions', permissionRoutes);
router.use('/roles', roleRoutes);
router.use('/services', serviceRoutes);
router.use('/settings', settingRoutes);
router.use('/sliders', sliderRoutes);
router.use('/terms-and-conditions', termAndConditionRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/translations', translationRoutes);
router.use("/dashboard", dashboardRoutes);



module.exports = router;
