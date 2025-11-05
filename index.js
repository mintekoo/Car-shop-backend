const path = require('path');
const express = require('express');
const cors = require('cors');
const  sequelize  = require('./config/database');

// Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', routes);




// Handle 404 - Route Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync all models
    await sequelize.sync({ force: false });
    console.log('✅ All models synced successfully');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
};

// Start the app
startServer();

// ===============================================
// 📤 EXPORT APP (for testing or external usage)
// ===============================================
module.exports = app;
