const { FAQ } = require('../models/index');

// CREATE FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, isActive } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const faq = await FAQ.create({
      question,
      answer,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'FAQ created successfully',
      faq
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL FAQS
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET FAQ BY ID
exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    res.status(200).json(faq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update FAQ by ID
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, isActive } = req.body;

    // Find FAQ by ID
    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Update fields if provided
    faq.question = question ?? faq.question;
    faq.answer = answer ?? faq.answer;
    faq.isActive = typeof isActive !== 'undefined' ? isActive : faq.isActive;

    // Save updated record
    await faq.save();

    res.status(200).json({
      message: 'FAQ updated successfully',
      faq,
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      message: 'An error occurred while updating the FAQ',
      error: error.message,
    });
  }
};

// DELETE FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await faq.destroy();
    res.status(200).json({
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};