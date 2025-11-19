const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const createMulter = require('../utils/multer');
// Multer instance for blog images
const { upload: uploadPartner } = createMulter('partners');

// CRUD routes
router.post('/',  uploadPartner.single('image'),  partnerController.createPartner);
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);
router.put('/:id',  uploadPartner.single('image'),  partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;
