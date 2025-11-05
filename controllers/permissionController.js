const { Permission, Role } = require('../models/index');

// CREATE PERMISSION
exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(409).json({ error: 'Permission with this name already exists' });
    }

    const permission = await Permission.create({
      name,
      description
    });

    res.status(201).json({
      message: 'Permission created successfully',
      permission
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PERMISSIONS
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PERMISSION BY ID
exports.getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id, {
      include: [
        {
          model: Role,
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE PERMISSION
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    await permission.destroy();
    res.status(200).json({
      message: 'Permission deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};