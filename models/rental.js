const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Rental = sequelize.define(
  "Rental",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const raw = this.getDataValue("features");
        try {
          return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return raw;
        }
      },
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
      get() {
        const raw = this.getDataValue("images");
        try {
          return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return raw;
        }
      },
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "rentals",
    timestamps: true,
  }
);

module.exports = Rental;
