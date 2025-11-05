const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Translation = sequelize.define('Translation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tableName: { type: DataTypes.STRING, allowNull: false },
  fieldName: { type: DataTypes.STRING, allowNull: false },
  foreignKey: { type: DataTypes.INTEGER, allowNull: false },
  languageCode: { type: DataTypes.STRING, allowNull: false },
  translation: { type: DataTypes.TEXT, allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'translations',
  timestamps: true,
});

module.exports = Translation;
