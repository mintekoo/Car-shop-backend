const { DataTypes } = require('sequelize');
const  sequelize  = require('../config/database');

const About = sequelize.define('About', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  values: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'abouts',
  timestamps: true,
});

module.exports = About;
