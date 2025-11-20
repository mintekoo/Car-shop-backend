const { Gallery } = require("../models/index");
const fs = require("fs");
const path = require("path");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");

// CREATE gallery
exports.createGallery = async (req, res) => {
  try {
    const { title } = req.body;

    // Handle uploaded images
    const images = req.files
      ? req.files.map((f) => path.join("uploads", "gallery", f.filename))
      : [];

    const gallery = await Gallery.create({ title, images });

    res.status(201).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all galleries with pagination
exports.getAllGalleries = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);
    const { count, rows } = await Gallery.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const meta = getPaginationMeta(page, limit, count);

    res.json({
      success: true,
      data: rows,
      meta,
    });
  } catch (error) {
    console.error("Error fetching galleries:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET single gallery by ID
exports.getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByPk(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE gallery
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, removeImages } = req.body;
    // removeImages should be an array of image paths/filenames to delete

    const gallery = await Gallery.findByPk(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    // Handle uploaded files
    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const newImages = uploadedFiles.map((f) =>
      path.join("uploads", "gallery", f.filename)
    );

    // Initialize current images
    let images = [...(gallery.images || [])];

    // Remove selected images if provided
    if (removeImages && Array.isArray(removeImages)) {
      removeImages.forEach((img) => {
        const index = images.indexOf(img);
        if (index !== -1) {
          images.splice(index, 1);

          // Delete file from disk
          const fullPath = path.join(__dirname, "..", img);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
      });
    }

    // Merge new images
    images = [...images, ...newImages];

    if (!title && images.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to update" });
    }

    await gallery.update({ title: title || gallery.title, images });

    res.json({ success: true, data: gallery });
  } catch (error) {
    console.error("Error updating gallery:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE gallery
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.findByPk(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    // Delete associated images from filesystem
    gallery.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", imgPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await gallery.destroy();

    res.json({ success: true, message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
