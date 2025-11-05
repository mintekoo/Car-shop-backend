const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'settings',
  timestamps: true,
});

module.exports = Setting;
