const path = require("path");
const {
  Product,
  User,
  Category,
  Location,
  Booking,
  Gallery,
} = require("../models/index");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");

// CREATE PRODUCT (Enhanced version)
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      model,
      make,
      year,
      seatingCapacity,
      pricePerDay,
      pricePerHour,
      ownerId,
      categoryId,
      status,
      features,
      location,
      isActive,
    } = req.body;

    //

    // Enhanced validation with type checking
    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Valid title is required" });
    }
    if (!model || typeof model !== "string") {
      return res.status(400).json({ error: "Valid model is required" });
    }
    if (!make || typeof make !== "string") {
      return res.status(400).json({ error: "Valid make is required" });
    }
    if (
      !year ||
      typeof year !== "number" ||
      year < 1900 ||
      year > new Date().getFullYear() + 1
    ) {
      return res.status(400).json({ error: "Valid year is required" });
    }
    if (
      !seatingCapacity ||
      typeof seatingCapacity !== "number" ||
      seatingCapacity < 1
    ) {
      return res
        .status(400)
        .json({ error: "Valid seating capacity is required" });
    }
    if (!pricePerDay || typeof pricePerDay !== "number" || pricePerDay < 0) {
      return res.status(400).json({ error: "Valid price per day is required" });
    }
    if (!ownerId || typeof ownerId !== "number" || ownerId < 1) {
      return res.status(400).json({ error: "Valid owner ID is required" });
    }

    // Check if owner exists and has correct role
    const owner = await User.findByPk(ownerId);
    if (!owner) {
      return res.status(404).json({ error: "Owner not found" });
    }
    if (owner.role !== "CarOwner" && owner.role !== "Admin") {
      return res
        .status(400)
        .json({ error: "User must be a CarOwner or Admin to create products" });
    }

    // Check if category exists if provided
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // ✅ Handle uploaded files (via multer)
    const images = req.files
      ? req.files.map((f) => path.join("uploads", "product", f.filename))
      : [];

    // ✅ Create the product
    const product = await Product.create({
      title: title.trim(),
      description: description?.trim(),
      model: model.trim(),
      make: make.trim(),
      year,
      seatingCapacity,
      pricePerDay,
      pricePerHour: pricePerHour || null,
      ownerId,
      categoryId: categoryId || null,
      status: status || "Available",
      features: Array.isArray(features) ? features : [],
      images,
      location: location?.trim(),
      isActive: isActive !== undefined ? isActive : true,
    });

    const productWithRelations = await Product.findByPk(product.id, {
      include: [
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
        // Remove Location include if you don't have Location model
      ],
    });

    res.status(201).json({
      message: "Product created successfully",
      product: productWithRelations,
    });
  } catch (error) {
    console.error("Create product error:", error);

    // Handle specific Sequelize errors
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(400)
        .json({ error: "Invalid owner or category reference" });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { rows: products, count: totalCount } = await Product.findAndCountAll(
      {
        include: [
          {
            model: User,
            // as: 'Owner',
            attributes: ["id", "firstName", "lastName", "email"],
          },
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: Location,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }
    );

    const meta = getPaginationMeta(page, limit, totalCount);

    res.status(200).json({ products, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
        {
          model: Location,
          attributes: ["id", "name", "description"],
        },
        {
          model: Booking,
          attributes: ["id", "startDate", "endDate", "status"],
        },
        {
          model: Gallery,
          attributes: ["id", "title", "images"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      model,
      make,
      year,
      seatingCapacity,
      pricePerDay,
      pricePerHour,
      categoryId,
      status,
      features,
      images,
      location,
      isActive,
    } = req.body;

    // Find product by ID
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Build update object with only provided fields
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (model !== undefined) updateData.model = model;
    if (make !== undefined) updateData.make = make;
    if (year !== undefined) updateData.year = year;
    if (seatingCapacity !== undefined)
      updateData.seatingCapacity = seatingCapacity;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;
    if (pricePerHour !== undefined) updateData.pricePerHour = pricePerHour;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (status !== undefined) updateData.status = status;
    if (features !== undefined) updateData.features = features;
    if (images !== undefined) updateData.images = images;
    if (location !== undefined) updateData.location = location;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validate data types for numeric fields
    if (
      updateData.year &&
      (typeof updateData.year !== "number" ||
        updateData.year < 1900 ||
        updateData.year > new Date().getFullYear() + 1)
    ) {
      return res.status(400).json({ error: "Valid year is required" });
    }

    if (
      updateData.seatingCapacity &&
      (typeof updateData.seatingCapacity !== "number" ||
        updateData.seatingCapacity < 1)
    ) {
      return res
        .status(400)
        .json({ error: "Valid seating capacity is required" });
    }

    if (
      updateData.pricePerDay &&
      (typeof updateData.pricePerDay !== "number" || updateData.pricePerDay < 0)
    ) {
      return res.status(400).json({ error: "Valid price per day is required" });
    }

    if (
      updateData.pricePerHour !== undefined &&
      updateData.pricePerHour !== null &&
      (typeof updateData.pricePerHour !== "number" ||
        updateData.pricePerHour < 0)
    ) {
      return res
        .status(400)
        .json({ error: "Valid price per hour is required" });
    }

    // Check if category exists if provided
    if (updateData.categoryId) {
      const category = await Category.findByPk(updateData.categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // Validate status if provided
    if (
      updateData.status &&
      !["Available", "Unavailable", "Maintenance", "Rented"].includes(
        updateData.status
      )
    ) {
      return res.status(400).json({
        error:
          "Invalid status. Must be one of: Available, Unavailable, Maintenance, Rented",
      });
    }

    // Update product
    await product.update(updateData);

    // Get updated product with relations
    const updatedProduct = await Product.findByPk(id, {
      include: [
        {
          model: User,
          // as: 'Owner',
          attributes: ["id", "firstName", "lastName", "email", "phone"],
        },
        {
          model: Category,
          attributes: ["id", "name", "description"],
        },
      ],
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        error: "Validation error",
        details: validationErrors,
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ error: "Invalid category reference" });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};
// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
