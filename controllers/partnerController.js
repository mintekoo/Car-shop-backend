const { Partner } = require('../models/index');

// CREATE PARTNER
exports.createPartner = async (req, res) => {
  try {
    const { name, logo, url, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const partner = await Partner.create({
      name,
      logo,
      url,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Partner created successfully',
      partner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PARTNERS
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PARTNER BY ID
exports.getPartnerById = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByPk(id);

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE PARTNER
exports.updatePartner = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, logo, url, isActive } = req.body;

    // Find partner by ID
    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    // Update only provided fields
    partner.name = name ?? partner.name;
    partner.logo = logo ?? partner.logo;
    partner.url = url ?? partner.url;
    partner.isActive = typeof isActive !== 'undefined' ? isActive : partner.isActive;

    // Save changes
    await partner.save();

    res.status(200).json({
      message: 'Partner updated successfully',
      partner,
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({
      message: 'An error occurred while updating the partner',
      error: error.message,
    });
  }
};
// DELETE PARTNER
exports.deletePartner = async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await Partner.findByPk(id);
    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    await partner.destroy();
    res.status(200).json({
      message: 'Partner deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};