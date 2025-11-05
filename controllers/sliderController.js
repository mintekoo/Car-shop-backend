const { Slider } = require('../models/index');

// CREATE SLIDER
exports.createSlider = async (req, res) => {
  try {
    const { title, image, link, isActive } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const slider = await Slider.create({
      title,
      image,
      link,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({
      message: 'Slider created successfully',
      slider
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL SLIDERS
exports.getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(sliders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SLIDER BY ID
exports.getSliderById = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findByPk(id);

    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    res.status(200).json(slider);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update a slider
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, link, isActive } = req.body;

    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    await slider.update({ title, image, link, isActive });
    return res.status(200).json(slider);
  } catch (error) {
    console.error('Update Slider Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update a slider
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, link, isActive } = req.body;

    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    await slider.update({ title, image, link, isActive });
    return res.status(200).json(slider);
  } catch (error) {
    console.error('Update Slider Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};



// DELETE SLIDER
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await Slider.findByPk(id);
    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }

    await slider.destroy();
    res.status(200).json({
      message: 'Slider deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};