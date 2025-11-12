const { User, Product, Booking, Blog, Testimonial } = require('../models/index');
const bcrypt = require('bcrypt');
const { getPaginationParams, getPaginationMeta } = require('../utils/pagination');
// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, isActive } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: role || 'Renter',
      isActive: isActive !== undefined ? isActive : true
    });

    const userResponse = { ...user.toJSON() };
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: "Invalid email or password" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: "Your account is deactivated" });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Remove password before sending response
    const userData = user.toJSON();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    // 1️⃣ Extract pagination parameters
    const { page, limit, offset } = getPaginationParams(req);

    // 2️⃣ Fetch users with pagination
    const { rows: users, count: totalCount } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      // ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    // 3️⃣ Generate pagination metadata
    const meta = getPaginationMeta(page, limit, totalCount);

    // 4️⃣ Return paginated data
    res.status(200).json({ users, meta });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER BY ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          // as: 'Products',
          attributes: ['id', 'title', 'pricePerDay', 'status']
        },
        {
          model: Booking,
          // as: 'RenterBookings',
          attributes: ['id', 'startDate', 'endDate', 'totalPrice', 'status']
        },
        {
          model: Booking,
          // as: 'OwnerBookings',
          attributes: ['id', 'startDate', 'endDate', 'totalPrice', 'status']
        },
        {
          model: Blog,
          attributes: ['id', 'title', 'isPublished', 'createdAt']
        },
        {
          model: Testimonial,
          attributes: ['id', 'clientName', 'content', 'rating']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      isActive
    } = req.body;

    // Find user by ID
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build update object with only provided fields
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // If email is being updated, check for duplicates
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { email: updateData.email } 
      });
      
      if (existingUser && existingUser.id !== parseInt(id)) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }

    // Update user
    await user.update(updateData);

    // Get updated user (excluding password)
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors.map(e => e.message) 
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};