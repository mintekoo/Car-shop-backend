const { Service } = require('../models/index');

// CREATE SERVICE
exports.createService = async (req, res) => {
  try {
    const { name, description, price, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const service = await Service.create({
      name,
      description,
      price,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Service created successfully',
      service
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL SERVICES
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SERVICE BY ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE SERVICE
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, isActive } = req.body;

    // Find service by ID
    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update only provided fields
    service.name = name ?? service.name;
    service.description = description ?? service.description;
    service.price = price ?? service.price;
    service.isActive = typeof isActive !== 'undefined' ? isActive : service.isActive;

    // Save changes
    await service.save();

    res.status(200).json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      message: 'An error occurred while updating the service',
      error: error.message,
    });
  }
};
// DELETE SERVICE
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.destroy();
    res.status(200).json({
      message: 'Service deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};