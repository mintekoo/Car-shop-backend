const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const createMulter = require('../utils/multer');

// Multer instance for product images
const { upload: uploadProduct } = createMulter('product');
// CRUD routes
router.post('/', uploadProduct.array('images', 5), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', uploadProduct.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
