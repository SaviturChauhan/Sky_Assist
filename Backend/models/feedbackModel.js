const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Feedback must belong to a passenger"],
    },
    flightNumber: {
      type: String,
      required: [true, "Please provide flight number"],
      trim: true,
    },
    flightDate: {
      type: Date,
      required: [true, "Please provide flight date"],
    },
    overallRating: {
      type: Number,
      required: [true, "Please provide overall rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    categoryRatings: {
      service: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
      },
      comfort: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
      },
      cleanliness: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
      },
      crew: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
      },
      food: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"],
      },
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [1000, "Comments cannot be more than 1000 characters"],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        enum: [
          "excellent-service",
          "delayed-flight",
          "comfortable-seats",
          "friendly-crew",
          "clean-cabin",
          "good-food",
          "poor-service",
          "uncomfortable",
          "dirty-cabin",
          "rude-crew",
          "poor-food",
          "on-time",
          "late-boarding",
          "lost-luggage",
          "entertainment-issues",
        ],
      },
    ],
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Can be marked as verified by admin if passenger was on the flight
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
feedbackSchema.index({ flightNumber: 1, flightDate: -1 });
feedbackSchema.index({ passenger: 1 });
feedbackSchema.index({ overallRating: 1 });
feedbackSchema.index({ createdAt: -1 });

// Prevent duplicate feedback from same passenger for same flight
// Note: flightDate should be normalized to start of day for this to work correctly
feedbackSchema.index(
  { passenger: 1, flightNumber: 1, flightDate: 1 },
  {
    unique: true,
    partialFilterExpression: { flightDate: { $exists: true } },
  }
);

// Virtual for average category rating
feedbackSchema.virtual("averageCategoryRating").get(function () {
  const ratings = Object.values(this.categoryRatings || {}).filter(
    (rating) => rating !== undefined && rating !== null
  );
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return (sum / ratings.length).toFixed(2);
});

module.exports = mongoose.model("Feedback", feedbackSchema);

