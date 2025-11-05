const path = require("path");
const { Testimonial, User } = require("../models/index");
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');

// CREATE TESTIMONIAL
exports.createTestimonial = async (req, res) => {
  try {
    const { clientName, content, rating, userId, isActive } = req.body;

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

    const testimonial = await Testimonial.create({
      clientName,
      content,
      rating,
      userId,
      isActive: isActive !== undefined ? isActive : true,
      image,
    });

    const testimonialWithRelations = await Testimonial.findByPk(
      testimonial.id,
      {
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      }
    );

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial: testimonialWithRelations,
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
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
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
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "email"],
        },
      ],
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
    const { clientName, content, rating, userId, isActive } = req.body;

    // Find the testimonial by ID
    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    // Update the testimonial fields
    await testimonial.update({ clientName, content, rating, userId, isActive });

    return res.status(200).json(testimonial);
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
