const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Route to get totals for dashboard
router.get("/", dashboardController.CountTotals);
router.get("/product", dashboardController.getProductStats);

module.exports = router;
