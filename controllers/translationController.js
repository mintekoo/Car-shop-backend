const { Translation, User } = require('../models/index');

// CREATE TRANSLATION
exports.createTranslation = async (req, res) => {
  try {
    const { tableName, fieldName, foreignKey, languageCode, translation, createdBy } = req.body;

    if (!tableName || !fieldName || !foreignKey || !languageCode || !translation) {
      return res.status(400).json({ error: 'tableName, fieldName, foreignKey, languageCode, and translation are required' });
    }

    // Check if user exists if provided
    if (createdBy) {
      const user = await User.findByPk(createdBy);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const translationRecord = await Translation.create({
      tableName,
      fieldName,
      foreignKey,
      languageCode,
      translation,
      createdBy
    });

    const translationWithRelations = await Translation.findByPk(translationRecord.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Translation created successfully',
      translation: translationWithRelations
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TRANSLATIONS
exports.getAllTranslations = async (req, res) => {
  try {
    const translations = await Translation.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(translations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET TRANSLATION BY ID
exports.getTranslationById = async (req, res) => {
  try {
    const { id } = req.params;

    const translation = await Translation.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });

    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    res.status(200).json(translation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update translation by ID
exports.updateTranslation = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName, fieldName, foreignKey, languageCode, translation, createdBy } = req.body;

    // Find the translation record by ID
    const record = await Translation.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    // Update fields
    await record.update({ tableName, fieldName, foreignKey, languageCode, translation, createdBy });

    return res.status(200).json(record);
  } catch (error) {
    console.error('Update Translation Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// DELETE TRANSLATION
exports.deleteTranslation = async (req, res) => {
  try {
    const { id } = req.params;

    const translation = await Translation.findByPk(id);
    if (!translation) {
      return res.status(404).json({ error: 'Translation not found' });
    }

    await translation.destroy();
    res.status(200).json({
      message: 'Translation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};