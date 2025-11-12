const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createDatabase } = require("./config/database.js");
const { syncDB } = require("./models/index.js");

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require("./routes");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", routes);
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "🎉 Welcome to the Addinas Car Service API!"
  });
});


// Handle 404 - Route Not Found
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log(
      "Attempting to connect to database and create if not exists..."
    );
    await createDatabase();

    console.log("Attempting to sync database tables with local models...");
    await syncDB();

    app.listen(PORT, () => {
      console.log(`✅ Contract Service running successfully on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error(
      "❌ Critical Error: Failed to initialize database or start server."
    );
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// ===============================================
// 📤 EXPORT APP (for testing or external usage)
// ===============================================
module.exports = app;
