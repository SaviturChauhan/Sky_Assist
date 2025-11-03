const mongoose = require("mongoose");
require("dotenv").config();

const Request = require("./models/requestModel");
const Announcement = require("./models/announcementModel");
const User = require("./models/userModel");

async function populateTestData() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB successfully!");

    // Get existing users
    const users = await User.find();
    if (users.length === 0) {
      console.log("❌ No users found. Please create users first.");
      return;
    }

    const passengers = users.filter((user) => user.role === "passenger");
    const crew = users.filter((user) => user.role === "crew");

    if (passengers.length === 0) {
      console.log("❌ No passengers found. Cannot create requests.");
      return;
    }

    if (crew.length === 0) {
      console.log("❌ No crew members found. Cannot create announcements.");
      return;
    }

    console.log(
      `Found ${passengers.length} passengers and ${crew.length} crew members`
    );

    // Create sample requests
    const sampleRequests = [
      {
        passenger: passengers[0]._id,
        title: "Need a blanket",
        description:
          "Could I please get an extra blanket? It's quite cold in the cabin.",
        category: "Comfort",
        priority: "Low",
        status: "New",
        seatNumber: "12A",
        flightNumber: "SA101",
        location: "Seat 12A",
      },
      {
        passenger: passengers[0]._id,
        title: "Feeling unwell",
        description:
          "I'm experiencing some nausea and dizziness. Could I get some assistance?",
        category: "Medical",
        priority: "High",
        status: "New",
        seatNumber: "12A",
        flightNumber: "SA101",
        isUrgent: true,
      },
      {
        passenger: passengers[0]._id,
        title: "Request for water",
        description:
          "Could I please get some water? I'm feeling quite thirsty.",
        category: "Drinks",
        priority: "Medium",
        status: "In Progress",
        seatNumber: "12A",
        flightNumber: "SA101",
        assignedTo: crew[0]._id,
      },
    ];

    // Add more requests if there are more passengers
    if (passengers.length > 1) {
      sampleRequests.push(
        {
          passenger: passengers[1]._id,
          title: "Seat adjustment help",
          description:
            "My seat seems to be stuck. Could someone help me adjust it?",
          category: "Comfort",
          priority: "Medium",
          status: "Acknowledged",
          seatNumber: "15C",
          flightNumber: "SA101",
        },
        {
          passenger: passengers[1]._id,
          title: "WiFi not working",
          description:
            "I can't connect to the in-flight WiFi. Could someone assist me?",
          category: "General",
          priority: "Low",
          status: "New",
          seatNumber: "15C",
          flightNumber: "SA101",
        }
      );
    }

    console.log("📋 Creating sample requests...");
    const createdRequests = await Request.insertMany(sampleRequests);
    console.log(`✅ Created ${createdRequests.length} requests`);

    // Create sample announcements
    const sampleAnnouncements = [
      {
        title: "Welcome Aboard",
        message:
          "Welcome to SkyAssist Flight SA101. We hope you have a pleasant journey with us today.",
        type: "General",
        priority: "Medium",
        createdBy: crew[0]._id,
        flightNumber: "SA101",
        targetAudience: "All",
        isActive: true,
        color: "blue",
        icon: "flight",
      },
      {
        title: "Turbulence Expected",
        message:
          "We may experience some mild turbulence in the next 20 minutes. Please remain seated with your seatbelt fastened.",
        type: "Safety",
        priority: "High",
        createdBy: crew[0]._id,
        flightNumber: "SA101",
        targetAudience: "All",
        isActive: true,
        color: "orange",
        icon: "warning",
      },
      {
        title: "Meal Service Starting",
        message:
          "Our meal service will begin shortly. Please have your meal preferences ready.",
        type: "Service",
        priority: "Medium",
        createdBy: crew[0]._id,
        flightNumber: "SA101",
        targetAudience: "Passengers",
        isActive: true,
        color: "green",
        icon: "restaurant",
      },
      {
        title: "Landing Preparation",
        message:
          "We will begin our descent shortly. Please ensure your seat is upright and tray tables are stowed.",
        type: "General",
        priority: "High",
        createdBy: crew[0]._id,
        flightNumber: "SA101",
        targetAudience: "All",
        isActive: true,
        color: "purple",
        icon: "landing",
      },
    ];

    console.log("📢 Creating sample announcements...");
    const createdAnnouncements = await Announcement.insertMany(
      sampleAnnouncements
    );
    console.log(`✅ Created ${createdAnnouncements.length} announcements`);

    // Final count
    console.log("\n📊 Final Database Statistics:");
    const totalRequests = await Request.countDocuments();
    const totalAnnouncements = await Announcement.countDocuments();
    console.log(`📋 Total Requests: ${totalRequests}`);
    console.log(`📢 Total Announcements: ${totalAnnouncements}`);
  } catch (error) {
    console.error("❌ Error populating test data:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔐 Database connection closed");
    process.exit(0);
  }
}

populateTestData();
