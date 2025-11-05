const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

// CRUD routes
router.post('/', partnerController.createPartner);
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);
router.put('/:id', partnerController.updatePartner);
router.delete('/:id', partnerController.deletePartner);

module.exports = router;