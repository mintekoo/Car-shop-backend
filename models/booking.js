const { DataTypes } = require("sequelize");
const  {sequelize}  = require('../config/database');

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    driver:{
      type: DataTypes.ENUM("yes", "no"),
      defaultValue: "no"
    },
    paymentStatus: {
      type: DataTypes.ENUM("Pending", "Paid", "Confirmed", "Refunded"),
      defaultValue: "Pending",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
  }
);

module.exports = Booking;
