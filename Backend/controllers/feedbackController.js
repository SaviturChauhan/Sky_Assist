const asyncHandler = require("express-async-handler");
const Feedback = require("../models/feedbackModel");

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private (Passenger only)
const createFeedback = asyncHandler(async (req, res) => {
  const {
    flightNumber,
    flightDate,
    overallRating,
    categoryRatings,
    comments,
    isAnonymous,
    tags,
    wouldRecommend,
  } = req.body;

  // Normalize flight date to start of day for consistent comparison
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };
  
  const normalizedFlightDate = flightDate
    ? normalizeDate(flightDate)
    : normalizeDate(new Date());

  // Check if passenger already submitted feedback for this flight
  const existingFeedback = await Feedback.findOne({
    passenger: req.user.id,
    flightNumber: flightNumber || req.user.flightNumber,
    flightDate: normalizedFlightDate,
  });

  if (existingFeedback) {
    res.status(400);
    throw new Error("You have already submitted feedback for this flight");
  }

  const feedback = await Feedback.create({
    passenger: req.user.id,
    flightNumber: flightNumber || req.user.flightNumber,
    flightDate: normalizedFlightDate,
    overallRating,
    categoryRatings,
    comments,
    isAnonymous: isAnonymous || false,
    tags,
    wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : true,
  });

  const populatedFeedback = await Feedback.findById(feedback._id).populate(
    "passenger",
    isAnonymous ? "flightNumber" : "name email seatNumber flightNumber"
  );

  res.status(201).json({
    success: true,
    message: "Feedback submitted successfully",
    data: populatedFeedback,
  });
});

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Private
const getFeedback = asyncHandler(async (req, res) => {
  const {
    flightNumber,
    flightDate,
    minRating,
    maxRating,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter object
  const filter = {};

  // If user is passenger, only show their feedback
  if (req.user.role === "passenger") {
    filter.passenger = req.user.id;
  }

  // Add flight number filter
  if (flightNumber) {
    filter.flightNumber = flightNumber;
  }

  // Add flight date filter
  if (flightDate) {
    const date = new Date(flightDate);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    filter.flightDate = {
      $gte: date,
      $lt: nextDay,
    };
  }

  // Add rating filter
  if (minRating) {
    filter.overallRating = { ...filter.overallRating, $gte: parseInt(minRating) };
  }
  if (maxRating) {
    filter.overallRating = { ...filter.overallRating, $lte: parseInt(maxRating) };
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const feedback = await Feedback.find(filter)
    .populate(
      "passenger",
      req.user.role === "crew" || req.user.role === "admin"
        ? "name email seatNumber flightNumber"
        : "flightNumber"
    )
    .sort(sort);

  res.json({
    success: true,
    count: feedback.length,
    data: feedback,
  });
});

// @desc    Get single feedback
// @route   GET /api/feedback/:id
// @access  Private
const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id).populate(
    "passenger",
    req.user.role === "crew" || req.user.role === "admin"
      ? "name email seatNumber flightNumber"
      : "flightNumber"
  );

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  // Check if user can access this feedback
  if (
    req.user.role === "passenger" &&
    feedback.passenger._id.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to access this feedback");
  }

  res.json({
    success: true,
    data: feedback,
  });
});

// @desc    Update feedback
// @route   PUT /api/feedback/:id
// @access  Private (Passenger only, or Admin for verification)
const updateFeedback = asyncHandler(async (req, res) => {
  let feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  // Passengers can only update their own feedback
  if (req.user.role === "passenger") {
    if (feedback.passenger.toString() !== req.user.id) {
      res.status(403);
      throw new Error("Not authorized to update this feedback");
    }

    // Passengers can update most fields except isVerified
    const {
      overallRating,
      categoryRatings,
      comments,
      isAnonymous,
      tags,
      wouldRecommend,
    } = req.body;

    feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      {
        overallRating,
        categoryRatings,
        comments,
        isAnonymous,
        tags,
        wouldRecommend,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } else if (req.user.role === "admin") {
    // Admin can mark feedback as verified
    if (req.body.isVerified !== undefined) {
      feedback.isVerified = req.body.isVerified;
      await feedback.save();
    } else {
      res.status(400);
      throw new Error("Admins can only update verification status");
    }
  } else {
    res.status(403);
    throw new Error("Not authorized to update feedback");
  }

  const populatedFeedback = await Feedback.findById(feedback._id).populate(
    "passenger",
    feedback.isAnonymous && req.user.role !== "admin"
      ? "flightNumber"
      : "name email seatNumber flightNumber"
  );

  res.json({
    success: true,
    message: "Feedback updated successfully",
    data: populatedFeedback,
  });
});

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
const deleteFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) {
    res.status(404);
    throw new Error("Feedback not found");
  }

  // Only passengers can delete their own feedback, or admin can delete any
  if (
    req.user.role === "passenger" &&
    feedback.passenger.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this feedback");
  }

  await Feedback.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Feedback deleted successfully",
  });
});

// @desc    Get feedback statistics
// @route   GET /api/feedback/stats
// @access  Private (Crew/Admin only)
const getFeedbackStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "crew" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view feedback statistics");
  }

  const { flightNumber, startDate, endDate } = req.query;

  // Build filter object
  const filter = {};
  if (flightNumber) {
    filter.flightNumber = flightNumber;
  }
  if (startDate || endDate) {
    filter.flightDate = {};
    if (startDate) {
      filter.flightDate.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      filter.flightDate.$lt = end;
    }
  }

  // Overall statistics
  const overallStats = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        totalFeedback: { $sum: 1 },
        averageRating: { $avg: "$overallRating" },
        minRating: { $min: "$overallRating" },
        maxRating: { $max: "$overallRating" },
        ratingDistribution: {
          $push: "$overallRating",
        },
        wouldRecommendCount: {
          $sum: { $cond: [{ $eq: ["$wouldRecommend", true] }, 1, 0] },
        },
        verifiedCount: {
          $sum: { $cond: [{ $eq: ["$isVerified", true] }, 1, 0] },
        },
      },
    },
  ]);

  // Category rating statistics
  const categoryStats = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        avgService: { $avg: "$categoryRatings.service" },
        avgComfort: { $avg: "$categoryRatings.comfort" },
        avgCleanliness: { $avg: "$categoryRatings.cleanliness" },
        avgCrew: { $avg: "$categoryRatings.crew" },
        avgFood: { $avg: "$categoryRatings.food" },
      },
    },
  ]);

  // Rating distribution
  const ratingDistribution = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$overallRating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
  ]);

  // Flight statistics
  const flightStats = await Feedback.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$flightNumber",
        count: { $sum: 1 },
        averageRating: { $avg: "$overallRating" },
      },
    },
    { $sort: { averageRating: -1 } },
    { $limit: 10 },
  ]);

  // Tag statistics
  const tagStats = await Feedback.aggregate([
    { $match: filter },
    { $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  // Recent feedback count
  const recentFeedback = await Feedback.countDocuments({
    ...filter,
    createdAt: {
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    },
  });

  const stats = overallStats[0] || {
    totalFeedback: 0,
    averageRating: 0,
    minRating: 0,
    maxRating: 0,
    wouldRecommendCount: 0,
    verifiedCount: 0,
  };

  // Calculate recommendation percentage
  const recommendationPercentage =
    stats.totalFeedback > 0
      ? ((stats.wouldRecommendCount / stats.totalFeedback) * 100).toFixed(2)
      : 0;

  // Calculate rating distribution percentages
  const ratingDist = {};
  ratingDistribution.forEach((item) => {
    ratingDist[item._id] = {
      count: item.count,
      percentage: ((item.count / stats.totalFeedback) * 100).toFixed(2),
    };
  });

  res.json({
    success: true,
    data: {
      overview: {
        totalFeedback: stats.totalFeedback,
        averageRating: stats.averageRating
          ? parseFloat(stats.averageRating.toFixed(2))
          : 0,
        minRating: stats.minRating || 0,
        maxRating: stats.maxRating || 0,
        recommendationPercentage: parseFloat(recommendationPercentage),
        verifiedCount: stats.verifiedCount,
        recentFeedback,
      },
      categoryRatings: categoryStats[0]
        ? {
            service: parseFloat((categoryStats[0].avgService || 0).toFixed(2)),
            comfort: parseFloat((categoryStats[0].avgComfort || 0).toFixed(2)),
            cleanliness: parseFloat(
              (categoryStats[0].avgCleanliness || 0).toFixed(2)
            ),
            crew: parseFloat((categoryStats[0].avgCrew || 0).toFixed(2)),
            food: parseFloat((categoryStats[0].avgFood || 0).toFixed(2)),
          }
        : {
            service: 0,
            comfort: 0,
            cleanliness: 0,
            crew: 0,
            food: 0,
          },
      ratingDistribution: ratingDist,
      topFlights: flightStats,
      topTags: tagStats,
    },
  });
});

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
};

