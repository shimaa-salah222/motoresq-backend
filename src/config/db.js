const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    console.log('✅ Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 60000,
      connectTimeoutMS: 60000,
      socketTimeoutMS: 60000,
    });
    
    cachedConnection = mongoose.connection;
    console.log('✅ MongoDB Connected (new connection)');
    return cachedConnection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
};

module.exports = connectDB;