const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an announcement title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    message: {
      type: String,
      required: [true, "Please provide an announcement message"],
      trim: true,
      maxlength: [500, "Message cannot be more than 500 characters"],
    },
    type: {
      type: String,
      required: [true, "Please select an announcement type"],
      enum: {
        values: [
          "General",
          "Safety",
          "Weather",
          "Delay",
          "Service",
          "Emergency",
        ],
        message: "Please select a valid announcement type",
      },
      default: "General",
    },
    priority: {
      type: String,
      required: [true, "Please select a priority level"],
      enum: {
        values: ["Low", "Medium", "High", "Urgent"],
        message: "Please select a valid priority level",
      },
      default: "Medium",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Announcement must have a creator"],
    },
    flightNumber: {
      type: String,
      trim: true,
    },
    targetAudience: {
      type: String,
      enum: ["All", "Passengers", "Crew", "Specific"],
      default: "All",
    },
    targetSeats: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduledFor: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    color: {
      type: String,
      enum: ["blue", "red", "purple", "green", "orange", "gray"],
      default: "blue",
    },
    icon: {
      type: String,
      default: "campaign",
    },
    attachments: [
      {
        type: String, // URL to attachment
        description: String,
      },
    ],
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    statistics: {
      totalSent: {
        type: Number,
        default: 0,
      },
      totalRead: {
        type: Number,
        default: 0,
      },
      readRate: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
announcementSchema.index({ type: 1, priority: 1 });
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ isActive: 1, scheduledFor: 1 });

// Virtual for read rate calculation
announcementSchema.virtual("readRatePercentage").get(function () {
  if (this.statistics.totalSent === 0) return 0;
  return Math.round(
    (this.statistics.totalRead / this.statistics.totalSent) * 100
  );
});

// Update read statistics when someone reads the announcement
announcementSchema.methods.markAsRead = function (userId) {
  const existingRead = this.readBy.find(
    (read) => read.user.toString() === userId.toString()
  );

  if (!existingRead) {
    this.readBy.push({ user: userId });
    this.statistics.totalRead = this.readBy.length;
    this.statistics.readRate = this.readRatePercentage;
    return this.save();
  }

  return Promise.resolve(this);
};

// Check if announcement is expired
announcementSchema.methods.isExpired = function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Check if announcement should be active
announcementSchema.methods.shouldBeActive = function () {
  const now = new Date();

  // If scheduled for future, not active yet
  if (this.scheduledFor && now < this.scheduledFor) return false;

  // If expired, not active
  if (this.isExpired()) return false;

  return this.isActive;
};

module.exports = mongoose.model("Announcement", announcementSchema);
