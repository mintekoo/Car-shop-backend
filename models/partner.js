const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Partner = sequelize.define(
  "Partner",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
      get() {
        const raw = this.getDataValue("contact");
        try {
          return typeof raw === "string" ? JSON.parse(raw) : raw;
        } catch {
          return raw;
        }
      },
    },
  },
  {
    tableName: "partners",
    timestamps: true,
  }
);

module.exports = Partner;
