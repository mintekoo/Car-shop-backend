const { Setting } = require('../models/index');

// CREATE SETTING
exports.createSetting = async (req, res) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    const existingSetting = await Setting.findOne({ where: { key } });
    if (existingSetting) {
      return res.status(409).json({ error: 'Setting with this key already exists' });
    }

    const setting = await Setting.create({
      key,
      value
    });

    res.status(201).json({
      message: 'Setting created successfully',
      setting
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL SETTINGS
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SETTING BY ID
exports.getSettingById = async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await Setting.findByPk(id);

    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE SETTING
exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    // Find setting by ID
    const setting = await Setting.findByPk(id);
    if (!setting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    // Update only provided fields
    setting.key = key ?? setting.key;
    setting.value = value ?? setting.value;

    // Save changes
    await setting.save();

    res.status(200).json({
      message: 'Setting updated successfully',
      setting,
    });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({
      message: 'An error occurred while updating the setting',
      error: error.message,
    });
  }
};

// DELETE SETTING
exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const setting = await Setting.findByPk(id);
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    await setting.destroy();
    res.status(200).json({
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};