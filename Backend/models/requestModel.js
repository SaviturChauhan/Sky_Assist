const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Request must belong to a passenger"],
    },
    title: {
      type: String,
      required: [true, "Please provide a request title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a request description"],
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: {
        values: [
          "Medical",
          "Comfort",
          "Security",
          "Snacks",
          "Drinks",
          "General",
        ],
        message: "Please select a valid category",
      },
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
    status: {
      type: String,
      enum: {
        values: ["New", "Acknowledged", "In Progress", "Resolved", "Cancelled"],
        message: "Please select a valid status",
      },
      default: "New",
    },
    seatNumber: {
      type: String,
      required: [true, "Please provide seat number"],
      trim: true,
    },
    flightNumber: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    chatMessages: [
      {
        sender: {
          type: String,
          enum: ["passenger", "crew"],
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "Message cannot be more than 1000 characters"],
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolution: {
      type: String,
      trim: true,
      maxlength: [500, "Resolution cannot be more than 500 characters"],
    },
    resolvedAt: {
      type: Date,
    },
    estimatedResolutionTime: {
      type: Number, // in minutes
      default: 30,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isUrgent: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
requestSchema.index({ passenger: 1, status: 1 });
requestSchema.index({ category: 1, priority: 1 });
requestSchema.index({ createdAt: -1 });

// Virtual for time since creation
requestSchema.virtual("timeSinceCreation").get(function () {
  return Date.now() - this.createdAt.getTime();
});

// Update resolvedAt when status changes to Resolved
requestSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  next();
});

module.exports = mongoose.model("Request", requestSchema);
