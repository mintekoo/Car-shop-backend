const { Role, User, Permission } = require('../models/index');

// CREATE ROLE
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(409).json({ error: 'Role with this name already exists' });
    }

    const role = await Role.create({
      name,
      description
    });

    res.status(201).json({
      message: 'Role created successfully',
      role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL ROLES
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ROLE BY ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Permission,
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        }
      ]
    });

    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE ROLE
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await role.destroy();
    res.status(200).json({
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};