const { Contact } = require('../models/index');

// CREATE CONTACT
exports.createContact = async (req, res) => {
  try {
    const { name, email, subject, message, isRead } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      isRead: isRead || false
    });

    res.status(201).json({
      message: 'Contact message created successfully',
      contact
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CONTACTS
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CONTACT BY ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update contact (by ID)
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subject, message, isRead } = req.body;

    // Find contact by id
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // Update contact fields
    contact.name = name ?? contact.name;
    contact.email = email ?? contact.email;
    contact.subject = subject ?? contact.subject;
    contact.message = message ?? contact.message;
    contact.isRead = typeof isRead !== 'undefined' ? isRead : contact.isRead;

    // Save changes
    await contact.save();

    res.status(200).json({
      message: 'Contact updated successfully',
      contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      message: 'An error occurred while updating contact',
      error: error.message,
    });
  }
};
// DELETE CONTACT
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    await contact.destroy();
    res.status(200).json({
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};