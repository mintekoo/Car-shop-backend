const path = require("path");
const {
  Product,
  User,
  Category,
  Location,
  // Booking,
  // Gallery,
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
    if (!ownerId || isNaN(ownerId)) {
      return res
        .status(400)
        .json({ error: "Valid ownerId (integer) is required" });
    }
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

    // Create product
    await Product.create({
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

    // Simple success response
    res.status(201).json({ message: "Product created successfully" });
  } catch (error) {
    console.error("Create product error:", error);

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
        // include: [
        //   {
        //     model: User,
        //     // as: 'Owner',
        //     attributes: ["id", "firstName", "lastName", "email"],
        //   },
        //   {
        //     model: Category,
        //     attributes: ["id", "name"],
        //   }
        // ],
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
      // include: [
      //   {
      //     model: User,
      //     // as: 'Owner',
      //     attributes: ["id", "firstName", "lastName", "email", "phone"],
      //   },
      //   {
      //     model: Category,
      //     attributes: ["id", "name", "description"],
      //   },
      //   {
      //     model: Location,
      //     attributes: ["id", "name", "description"],
      //   },
      //   {
      //     model: Booking,
      //   },
      //   {
      //     model: Gallery,
      //     attributes: ["id", "title", "images"],
      //   },
      // ],
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryId = parseInt(id, 10); // ensure it's a number

    const { page, limit, offset } = getPaginationParams(req);

    const { rows: products, count: totalCount } = await Product.findAndCountAll(
      {
        where: { categoryId },
        // include: [
        //   {
        //     model: User,
        //     attributes: ["id", "firstName", "lastName", "email"],
        //   },
        //   {
        //     model: Category,
        //     attributes: ["id", "name"],
        //   },
        //   {
        //     model: Location,
        //     attributes: ["id", "name"],
        //   },
        // ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }
    );

    const meta = getPaginationMeta(page, limit, totalCount);

    res.status(200).json({ products, meta });
  } catch (error) {
    console.error(error);
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
      location,
      isActive,
      replaceImages,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const updateData = {};

    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (model) updateData.model = model.trim();
    if (make) updateData.make = make.trim();
    if (year !== undefined) updateData.year = year;
    if (seatingCapacity !== undefined)
      updateData.seatingCapacity = seatingCapacity;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay;
    if (pricePerHour !== undefined) updateData.pricePerHour = pricePerHour;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (status !== undefined) updateData.status = status;
    if (location !== undefined) updateData.location = location.trim();
    if (isActive !== undefined) updateData.isActive = isActive;

    // 🧩 Handle features (ensure JSON array)
    if (features !== undefined) {
      if (typeof features === "string") {
        try {
          updateData.features = JSON.parse(features);
        } catch {
          return res.status(400).json({ error: "Invalid JSON for features" });
        }
      } else if (Array.isArray(features)) {
        updateData.features = features;
      } else {
        return res
          .status(400)
          .json({ error: "Features must be an array or valid JSON string" });
      }
    }

    // 🖼️ Handle image updates
    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map((f) =>
        path.join("uploads", "product", f.filename)
      );

      if (replaceImages === "true" || replaceImages === true) {
        // Replace all existing images
        updateData.images = uploadedImages;
      } else {
        // Append new images to existing ones
        const currentImages = Array.isArray(product.images)
          ? product.images
          : [];
        updateData.images = [...currentImages, ...uploadedImages];
      }
    }

    // 🔍 Validate category if provided
    if (updateData.categoryId) {
      const category = await Category.findByPk(updateData.categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
    }

    // ✅ Validate product status
    const validStatuses = ["Available", "Rented", "Maintenance", "Unavailable"];
    if (updateData.status && !validStatuses.includes(updateData.status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // ⚙️ Perform update
    await product.update(updateData);

    // 🧾 Fetch updated product with relations
    // const updatedProduct = await Product.findByPk(id, {
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "firstName", "lastName", "email", "phone"],
    //     },
    //     {
    //       model: Category,
    //       attributes: ["id", "name", "description"],
    //     },
    //   ],
    // });

    return res.status(200).json({
      message: "Product updated successfully",
      // product: updatedProduct,
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
