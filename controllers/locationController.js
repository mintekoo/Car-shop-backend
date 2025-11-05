const { Location, Product } = require('../models/index');

// CREATE LOCATION
exports.createLocation = async (req, res) => {
  try {
    const { name, description, latitude, longitude } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const existingLocation = await Location.findOne({ where: { name } });
    if (existingLocation) {
      return res.status(409).json({ error: 'Location with this name already exists' });
    }

    const location = await Location.create({
      name,
      description,
      latitude,
      longitude
    });

    res.status(201).json({
      message: 'Location created successfully',
      location
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL LOCATIONS
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET LOCATION BY ID
exports.getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['id', 'title', 'pricePerDay', 'status']
        }
      ]
    });

    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE LOCATION
exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, latitude, longitude } = req.body;

    // Find the location by ID
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Update only provided fields
    location.name = name ?? location.name;
    location.description = description ?? location.description;
    location.latitude = latitude ?? location.latitude;
    location.longitude = longitude ?? location.longitude;

    // Save changes
    await location.save();

    res.status(200).json({
      message: 'Location updated successfully',
      location,
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      message: 'An error occurred while updating the location',
      error: error.message,
    });
  }
};
// DELETE LOCATION
exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    await location.destroy();
    res.status(200).json({
      message: 'Location deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};