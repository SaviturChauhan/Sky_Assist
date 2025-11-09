const mongoose = require("mongoose");

// Cache the connection to reuse in serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If we have a cached connection, check if it's still connected
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      // Connection is still active
      return cached.conn;
    } else {
      // Connection was lost, reset cache
      console.log("MongoDB connection lost, reconnecting...");
      cached.conn = null;
      cached.promise = null;
    }
  }

  // If we don't have a connection promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "Set" : "Not set");

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
      console.log(`Database: ${mongoose.connection.name}`);
      return mongoose;
    }).catch((error) => {
      console.error("❌ Database connection error:", error.message);
      console.error("Error details:", error);
      cached.promise = null; // Reset promise on error
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connection ready");
  } catch (e) {
    console.error("Failed to establish MongoDB connection:", e.message);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;
