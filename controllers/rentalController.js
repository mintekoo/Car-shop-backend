const { Rental } = require("../models/index");
const path = require("path");
const fs = require("fs");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");
const { normalizePhoneNumber } = require("../utils/phoneUtils");

// -------------------------------------------------------
// CREATE RENTAL
// -------------------------------------------------------
exports.createRental = async (req, res) => {
  try {
    const { fullName, Phone, price, features, startDate, endDate } = req.body;

    // Validation
    if (!fullName || !Phone || !price || !startDate || !endDate) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(Phone);
    if (!normalizedPhone) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    // Handle uploaded images
    const images = req.files
      ? req.files.map((file) => path.join("uploads", "rentals", file.filename))
      : [];

    const newRental = await Rental.create({
      fullName,
      Phone: normalizedPhone,
      price,
      features: features ? JSON.parse(features) : [],
      images,
      startDate,
      endDate,
    });

    res
      .status(201)
      .json({ message: "Rental created successfully", data: newRental });
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// GET ALL RENTALS
// -------------------------------------------------------
exports.getAllRentals = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const { rows, count } = await Rental.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const meta = getPaginationMeta(page, limit, count);

    res.json({ data: rows, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// GET RENTAL BY ID
// -------------------------------------------------------
exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json(rental);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// UPDATE RENTAL
// -------------------------------------------------------
exports.updateRental = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    let images = rental.images || [];

    // Remove images if requested
    if (req.body.removeImages) {
      const removeImages = JSON.parse(req.body.removeImages); // array of image paths
      images = images.filter((img) => !removeImages.includes(img));

      // Delete removed images from filesystem
      removeImages.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          try {
            fs.unlinkSync(imgPath);
          } catch (err) {
            console.warn("Failed to delete image:", err.message);
          }
        }
      });
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) =>
        path.join("uploads", "rentals", file.filename)
      );
      images = [...images, ...newImages];
    }

    // Normalize phone number if provided
    let normalizedPhone = rental.Phone;
    if (req.body.Phone !== undefined) {
      const normalized = normalizePhoneNumber(req.body.Phone);
      if (!normalized) {
        return res.status(400).json({ error: "Invalid phone number" });
      }
      normalizedPhone = normalized;
    }

    await rental.update({
      fullName: req.body.fullName ?? rental.fullName,
      Phone: normalizedPhone,
      price: req.body.price ?? rental.price,
      features: req.body.features
        ? JSON.parse(req.body.features)
        : rental.features,
      images,
      startDate: req.body.startDate ?? rental.startDate,
      endDate: req.body.endDate ?? rental.endDate,
    });

    res.json({ message: "Rental updated successfully", data: rental });
  } catch (error) {
    console.error("Error updating rental:", error);
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// DELETE RENTAL
// -------------------------------------------------------
exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Delete images from filesystem
    if (rental.images && rental.images.length > 0) {
      rental.images.forEach((imgPath) => {
        if (fs.existsSync(imgPath)) {
          try {
            fs.unlinkSync(imgPath);
          } catch (err) {
            console.warn("Failed to delete image:", err.message);
          }
        }
      });
    }

    await rental.destroy();

    res.json({ message: "Rental deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
