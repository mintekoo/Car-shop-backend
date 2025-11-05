const { DataTypes } = require('sequelize');
const  sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  renterId: { type: DataTypes.INTEGER, allowNull: false },
  ownerId: { type: DataTypes.INTEGER, allowNull: false },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed'),
    defaultValue: 'Pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Refunded'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'bookings',
  timestamps: true,
});

module.exports = Booking;
