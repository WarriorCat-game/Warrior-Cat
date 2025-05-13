/**
 * Database configuration for the application
 */
const mongoose = require('mongoose');

// Get database connection settings from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/warrior_cat';

/**
 * Initialize database connection
 * @returns {Promise} Mongoose connection promise
 */
const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Close database connection
 * @returns {Promise} Mongoose disconnect promise
 */
const closeDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

module.exports = {
  connectDatabase,
  closeDatabase,
  MONGODB_URI
}; 