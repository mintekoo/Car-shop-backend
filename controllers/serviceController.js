const path = require("path");
const fs = require("fs");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");
const { Service } = require("../models/index");

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const image = req.file
      ? path.join("uploads", "services", req.file.filename)
      : null;

    const service = await Service.create({
      name,
      description,
      price,
      image,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    // 1️⃣ Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2️⃣ Fetch services with pagination
    const { rows: services, count: totalCount } = await Service.findAndCountAll(
      {
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      }
    );

    // 3️⃣ Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4️⃣ Return paginated results
    res.status(200).json({ services, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SERVICE BY ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    // ✅ Handle uploaded image
    let imagePath = service.image;

    if (req.file) {
      imagePath = path.join("uploads", "services", req.file.filename);

      if (service.image && fs.existsSync(service.image)) {
        try {
          fs.unlinkSync(service.image);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
    }

    // ✅ Update record
    await service.update({
      name: name ?? service.name,
      description: description ?? service.description,
      price: price ?? service.price,
      image: imagePath,
      isActive: isActive !== undefined ? isActive : service.isActive,
    });

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    await service.destroy();
    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
