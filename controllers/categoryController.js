const path = require('path');
const { Category, Product, Blog } = require('../models/index');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

// CREATE CATEGORY (Enhanced with proper error handling)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const existingCategory = await Category.findOne({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    // Handle uploaded image
    const image = req.file
      ? path.join('uploads', 'categories', req.file.filename)
      : null;

    const category = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : null,
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validationErrors,
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
    });
  }
};

// GET ALL CATEGORIES
exports.getAllCategories = async (req, res) => {
  try {
    // 1️⃣ Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2️⃣ Fetch categories with pagination
    const { rows: categories, count: totalCount } = await Category.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // 3️⃣ Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4️⃣ Return paginated data
    res.status(200).json({ categories, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CATEGORY BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay']
        },
        {
          model: Blog,
          attributes: ['id', 'title', 'isPublished', 'createdAt']
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    // Find the category by ID
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update the category
    await category.update(updateData);

    // Fetch the updated category
    const updatedCategory = await Category.findByPk(id);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });

  } catch (error) {
    console.error('Error updating category:', error);
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};


// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();
    res.status(200).json({
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};