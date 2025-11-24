const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const createMulter = require('../utils/multer');

// Multer instance for rental images (multiple)
const { upload: uploadRental } = createMulter('rentals');

// CRUD routes
router.post('/', uploadRental.array('images', 5), rentalController.createRental);
router.get('/', rentalController.getAllRentals);
router.get('/:id', rentalController.getRentalById);
router.put('/:id', uploadRental.array('images', 5), rentalController.updateRental);
router.delete('/:id', rentalController.deleteRental);

module.exports = router;
