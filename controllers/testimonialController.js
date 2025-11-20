const fs = require("fs");
const path = require("path");
const { Testimonial, User } = require("../models/index");
const {
  getPaginationParams,
  getPaginationMeta,
} = require("../utils/pagination");

// CREATE TESTIMONIAL
exports.createTestimonial = async (req, res) => {
  try {
    const { clientName, content, rating, userId, company, position } = req.body;

    if (!clientName || !content) {
      return res
        .status(400)
        .json({ error: "Client name and content are required" });
    }

    // Check if user exists if provided
    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
    }

    // ✅ Handle single uploaded image (relative path)
    const image = req.file
      ? path.join("uploads", "testimonials", req.file.filename)
      : null;

    await Testimonial.create({
      clientName,
      content,
      rating,
      userId,
      company: company ?? null,
      position: position ?? null,
      image,
    });

    res.status(201).json({
      message: "Testimonial created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TESTIMONIALS
exports.getAllTestimonials = async (req, res) => {
  try {
    // 1. Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2. Fetch testimonials with pagination
    const { rows: testimonials, count: totalCount } =
      await Testimonial.findAndCountAll({
        // include: [
        //   {
        //     model: User,
        //     attributes: ["id", "firstName", "lastName", "email"],
        //   },
        // ],
        order: [["createdAt", "DESC"]],
        limit,
        offset,
      });

    // 3. Build pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4. Return paginated data
    res.status(200).json({ testimonials, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET TESTIMONIAL BY ID
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id, {
      // include: [
      //   {
      //     model: User,
      //     attributes: ["id", "firstName", "lastName", "email"],
      //   },
      // ],
    });

    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update testimonial by ID
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, content, rating, company, position } = req.body;

    // 1️⃣ Find existing testimonial
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // 3️⃣ Handle image upload (if a new one was provided)
    let imagePath = testimonial.image;

    if (req.file) {
      imagePath = path.join("uploads", "testimonials", req.file.filename);

      // Delete old image if exists
      if (testimonial.image && fs.existsSync(testimonial.image)) {
        try {
          fs.unlinkSync(testimonial.image);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
    }

    // 4️⃣ Update testimonial fields
    await testimonial.update({
      clientName: clientName ?? testimonial.clientName,
      content: content ?? testimonial.content,
      rating: rating ?? testimonial.rating,
      company: company ?? testimonial.company,
      position: position ?? testimonial.position,
      image: imagePath,
    });

    res.status(200).json({
      message: "Testimonial updated successfully",
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE TESTIMONIAL
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    await testimonial.destroy();
    res.status(200).json({
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
