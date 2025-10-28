require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
  try {
    console.log("🔄 Testing database connection...");
    console.log(
      "Connection string:",
      process.env.MONGO_URI ? "Found" : "Missing"
    );

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Database connection successful!");
    console.log(`📊 Connected to: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);

    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Collections: ${collections.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("authentication failed")) {
      console.log(
        "\n💡 Solution: Check your username and password in .env file"
      );
    } else if (error.message.includes("network")) {
      console.log(
        "\n💡 Solution: Check your internet connection and MongoDB Atlas cluster status"
      );
    } else if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Solution: Check your MongoDB Atlas connection string");
    }

    process.exit(1);
  }
}

testConnection();
