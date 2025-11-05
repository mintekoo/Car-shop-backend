const { Client } = require('../models/index');

// CREATE CLIENT
exports.createClient = async (req, res) => {
  try {
    const { fullName, email, phone, address, isActive } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    const existingClient = await Client.findOne({ where: { email } });
    if (existingClient) {
      return res.status(409).json({ error: 'Client with this email already exists' });
    }

    const client = await Client.create({
      fullName,
      email,
      phone,
      address,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Client created successfully',
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CLIENTS
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET CLIENT BY ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, address, isActive } = req.body;

    // Find the client by ID
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Prepare update data
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Update the client
    await client.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });

  } catch (error) {
    console.error('Error updating client:', error);
    
    // Handle unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
// DELETE CLIENT
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();
    res.status(200).json({
      message: 'Client deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};