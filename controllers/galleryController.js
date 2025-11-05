const { Gallery, Product } = require('../models/index');

// CREATE GALLERY
exports.createGallery = async (req, res) => {
  try {
    const { title, images, productId, isActive } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' });
    }

    // Check if product exists if provided
    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
    }

    const gallery = await Gallery.create({
      title,
      images,
      productId,
      isActive: isActive !== undefined ? isActive : true
    });

    const galleryWithRelations = await Gallery.findByPk(gallery.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay']
        }
      ]
    });

    res.status(201).json({
      message: 'Gallery created successfully',
      gallery: galleryWithRelations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL GALLERIES
exports.getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(galleries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET GALLERY BY ID
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay', 'description']
        }
      ]
    });

    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE GALLERY
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, images, productId, isActive } = req.body;

    // Find gallery by ID
    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ message: 'Gallery not found' });
    }

    // If productId is provided, check if product exists
    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    // Update fields if provided
    gallery.title = title ?? gallery.title;
    gallery.images = Array.isArray(images) ? images : gallery.images;
    gallery.productId = productId ?? gallery.productId;
    gallery.isActive = typeof isActive !== 'undefined' ? isActive : gallery.isActive;

    // Save updated record
    await gallery.save();

    // Re-fetch with relations (optional)
    const updatedGallery = await Gallery.findByPk(gallery.id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay'],
        },
      ],
    });

    res.status(200).json({
      message: 'Gallery updated successfully',
      gallery: updatedGallery,
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({
      message: 'An error occurred while updating the gallery',
      error: error.message,
    });
  }
};

// DELETE GALLERY
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      return res.status(404).json({ error: 'Gallery not found' });
    }

    await gallery.destroy();
    res.status(200).json({
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};