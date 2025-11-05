const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  model: { type: DataTypes.STRING, allowNull: false },
  make: { type: DataTypes.STRING, allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  seatingCapacity: { type: DataTypes.INTEGER, allowNull: false },
  pricePerDay: { type: DataTypes.FLOAT, allowNull: false },
  pricePerHour: { type: DataTypes.FLOAT, allowNull: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
  status: {
    type: DataTypes.ENUM('Available', 'Rented', 'Maintenance', 'Unavailable'),
    defaultValue: 'Available',
  },
  features: { type: DataTypes.JSON, defaultValue: [] },
  images: { type: DataTypes.JSON, defaultValue: [] },
  location: { type: DataTypes.STRING, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
