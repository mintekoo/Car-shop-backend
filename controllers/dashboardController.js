const { sequelize } = require("../config/database");
const { QueryTypes } = require("sequelize");

const Category = require("../models/category");
const Product = require("../models/product");
const Booking = require("../models/booking");
const Blog = require("../models/blog");
const Service = require("../models/service");

exports.CountTotals = async (req, res) => {
  try {
    const [
      categoryTotal,
      productTotal,
      bookingTotal,
      blogTotal,
      serviceTotal,
    ] = await Promise.all([
      Category.count(),
      Product.count(),
      Booking.count(),
      Blog.count(),
      Service.count(),
    ]);

    res.status(200).json({
      categoryTotal,
      productTotal,
      bookingTotal,
      blogTotal,
      serviceTotal,
    });
  } catch (error) {
    console.error("Error counting totals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getProductStats = async (req, res) => {
  try {
    // Get monthly product creation stats for current year
    const monthlyProducts = await sequelize.query(
      `
      SELECT 
        DATE_FORMAT(createdAt, '%b') AS month,
        COUNT(*) AS total
      FROM products
      WHERE YEAR(createdAt) = YEAR(CURDATE())
      GROUP BY MONTH(createdAt)
      ORDER BY MONTH(createdAt)
      `,
      { type: QueryTypes.SELECT }
    );

    // Make sure all months are included
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyProductData = months.map((m) => {
      const found = monthlyProducts.find((p) => p.month === m);
      return found ? Number(found.total) : 0;
    });

    res.status(200).json({
      monthlyProductData,
    });
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
