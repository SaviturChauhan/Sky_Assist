const mongoose = require("mongoose");
require("dotenv").config();

const Request = require("./models/requestModel");
const Announcement = require("./models/announcementModel");
const User = require("./models/userModel");

async function testDatabaseConnection() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Test collections
    console.log("\n📊 Database Statistics:");

    const userCount = await User.countDocuments();
    console.log(`👥 Users: ${userCount}`);

    const requestCount = await Request.countDocuments();
    console.log(`📋 Requests: ${requestCount}`);

    const announcementCount = await Announcement.countDocuments();
    console.log(`📢 Announcements: ${announcementCount}`);

    // Sample data from each collection
    console.log("\n🔍 Sample Data:");

    if (userCount > 0) {
      const sampleUsers = await User.find()
        .limit(3)
        .select("name email role createdAt");
      console.log("Recent Users:", sampleUsers);
    } else {
      console.log("No users found in database");
    }

    if (requestCount > 0) {
      const sampleRequests = await Request.find()
        .populate("passenger", "name email")
        .limit(3)
        .select("title category status priority createdAt");
      console.log("Recent Requests:", sampleRequests);
    } else {
      console.log("No requests found in database");
    }

    if (announcementCount > 0) {
      const sampleAnnouncements = await Announcement.find()
        .populate("createdBy", "name email")
        .limit(3)
        .select("title type priority isActive createdAt");
      console.log("Recent Announcements:", sampleAnnouncements);
    } else {
      console.log("No announcements found in database");
    }

    // Check for any data issues
    console.log("\n🔧 Data Integrity Check:");

    const requestsWithoutPassenger = await Request.countDocuments({
      passenger: null,
    });
    console.log(`Requests without passenger: ${requestsWithoutPassenger}`);

    const announcementsWithoutCreator = await Announcement.countDocuments({
      createdBy: null,
    });
    console.log(
      `Announcements without creator: ${announcementsWithoutCreator}`
    );
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  } finally {
    await mongoose.connection.close();
    console.log("\n🔐 Database connection closed");
    process.exit(0);
  }
}

testDatabaseConnection();
