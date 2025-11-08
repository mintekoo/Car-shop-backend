const path = require('path');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
const { About } = require('../models/index');

// CREATE ABOUT
exports.createAbout = async (req, res) => {
  try {
    const { title, description, vision, mission, values, isActive } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
     // ✅ Handle uploaded files (via multer)
    const image = req.file
      ? path.join("uploads", "abouts", req.file.filename)
      : null;
    const about = await About.create({
      title,
      description,
      image,
      vision,
      mission,
      values,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'About created successfully',
      about
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAbouts = async (req, res) => {
  try {
    // 1️⃣ Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2️⃣ Fetch abouts with pagination
    const { rows: abouts, count: totalCount } = await About.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    // 3️⃣ Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4️⃣ Return paginated results
    res.status(200).json({ abouts, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ACTIVE ABOUT
exports.getActiveAbout = async (req, res) => {
  try {
    const about = await About.findOne({
      where: { isActive: true }
    });

    if (!about) {
      return res.status(404).json({ error: 'No active about entry found' });
    }

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ABOUT BY ID
exports.getAboutById = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findByPk(id);

    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE ABOUT
exports.updateAbout = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, vision, mission, values, isActive } = req.body;

    const about = await About.findByPk(id);
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    await about.update({
      title: title || about.title,
      description: description !== undefined ? description : about.description,
      image: image !== undefined ? image : about.image,
      vision: vision !== undefined ? vision : about.vision,
      mission: mission !== undefined ? mission : about.mission,
      values: values !== undefined ? values : about.values,
      isActive: isActive !== undefined ? isActive : about.isActive
    });

    res.status(200).json({
      message: 'About updated successfully',
      about
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ABOUT
exports.deleteAbout = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findByPk(id);
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    await about.destroy();
    res.status(200).json({
      message: 'About deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TOGGLE ABOUT ACTIVATION
exports.toggleAboutActivation = async (req, res) => {
  try {
    const { id } = req.params;

    const about = await About.findByPk(id);
    if (!about) {
      return res.status(404).json({ error: 'About entry not found' });
    }

    // Deactivate all other about entries if activating this one
    if (!about.isActive) {
      await About.update({ isActive: false }, { where: {} });
    }

    await about.update({ isActive: !about.isActive });

    res.status(200).json({
      message: `About ${about.isActive ? 'activated' : 'deactivated'} successfully`,
      about
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};