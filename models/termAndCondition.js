const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TermAndCondition = sequelize.define('TermAndCondition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'terms_and_conditions',
  timestamps: true,
});

module.exports = TermAndCondition;
