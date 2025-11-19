const { Partner } = require('../models/index');
const path = require("path");
const fs = require("fs");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");

// -------------------------------------------------------
// CREATE PARTNER
// -------------------------------------------------------
exports.createPartner = async (req, res) => {
  try {
    const { name, contact } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Store uploaded image as "uploads/partners/filename"
    const image = req.file
      ? path.join("uploads", "partners", req.file.filename)
      : null;

    const newPartner = await Partner.create({
      name,
      image,
      contact: contact ? JSON.parse(contact) : null,
    });

    res.status(201).json({
      message: "Partner created successfully",
      data: newPartner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// GET ALL PARTNERS
// -------------------------------------------------------
exports.getAllPartners = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req);

    const { rows, count } = await Partner.findAndCountAll({
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
// GET PARTNER BY ID
// -------------------------------------------------------
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// UPDATE PARTNER
// -------------------------------------------------------
exports.updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    let imagePath = partner.image;

    // If uploading new image
    if (req.file) {
      // Build new path
      imagePath = path.join("uploads", "partners", req.file.filename);

      // Delete old image if exists
      if (partner.image && fs.existsSync(partner.image)) {
        try {
          fs.unlinkSync(partner.image);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
    }

    await partner.update({
      name: req.body.name ?? partner.name,
      contact: req.body.contact
        ? JSON.parse(req.body.contact)
        : partner.contact,
      image: imagePath,
    });

    res.json({
      message: "Partner updated successfully",
      data: partner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------------------------------------------
// DELETE PARTNER
// -------------------------------------------------------
exports.deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // Delete image file if exists
    if (partner.image && fs.existsSync(partner.image)) {
      try {
        fs.unlinkSync(partner.image);
      } catch (err) {
        console.warn("Failed to delete image:", err.message);
      }
    }

    await partner.destroy();

    res.json({ message: "Partner deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
