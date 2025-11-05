const { TermAndCondition } = require('../models/index');

// CREATE TERM AND CONDITION
exports.createTermAndCondition = async (req, res) => {
  try {
    const { title, content, isActive } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const termAndCondition = await TermAndCondition.create({
      title,
      content,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Term and condition created successfully',
      termAndCondition
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL TERMS AND CONDITIONS
exports.getAllTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermAndCondition.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(termsAndConditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET TERM AND CONDITION BY ID
exports.getTermAndConditionById = async (req, res) => {
  try {
    const { id } = req.params;

    const termAndCondition = await TermAndCondition.findByPk(id);

    if (!termAndCondition) {
      return res.status(404).json({ error: 'Term and condition not found' });
    }

    res.status(200).json(termAndCondition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update TermAndCondition by ID
exports.updateTermAndCondition = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isActive } = req.body;

    // Find the record by ID
    const term = await TermAndCondition.findByPk(id);
    if (!term) {
      return res.status(404).json({ error: 'Term and condition not found' });
    }

    // Update fields
    await term.update({ title, content, isActive });

    return res.status(200).json(term);
  } catch (error) {
    console.error('Update Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE TERM AND CONDITION
exports.deleteTermAndCondition = async (req, res) => {
  try {
    const { id } = req.params;

    const termAndCondition = await TermAndCondition.findByPk(id);
    if (!termAndCondition) {
      return res.status(404).json({ error: 'Term and condition not found' });
    }

    await termAndCondition.destroy();
    res.status(200).json({
      message: 'Term and condition deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};