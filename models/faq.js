const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'faqs',
  timestamps: true,
});

module.exports = FAQ;
