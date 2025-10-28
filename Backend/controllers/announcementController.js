const asyncHandler = require("express-async-handler");
const Announcement = require("../models/announcementModel");

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = asyncHandler(async (req, res) => {
  const { type, priority, isActive } = req.query;

  // Build filter object
  const filter = {};

  if (type && type !== "All") {
    filter.type = type;
  }

  if (priority && priority !== "All") {
    filter.priority = priority;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: announcements.length,
    data: announcements,
  });
});

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
const getAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  res.json({
    success: true,
    data: announcement,
  });
});

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Crew only)
const createAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type,
    priority,
    flightNumber,
    targetAudience,
    targetSeats,
    scheduledFor,
    expiresAt,
    color,
    icon,
    attachments,
  } = req.body;

  const announcement = await Announcement.create({
    title,
    message,
    type,
    priority,
    createdBy: req.user.id,
    flightNumber,
    targetAudience,
    targetSeats,
    scheduledFor,
    expiresAt,
    color,
    icon,
    attachments,
  });

  const populatedAnnouncement = await Announcement.findById(
    announcement._id
  ).populate("createdBy", "name email role");

  res.status(201).json({
    success: true,
    message: "Announcement created successfully",
    data: populatedAnnouncement,
  });
});

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Crew only)
const updateAnnouncement = asyncHandler(async (req, res) => {
  let announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  // Check if user created this announcement or is admin
  if (
    announcement.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this announcement");
  }

  announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  const populatedAnnouncement = await Announcement.findById(
    announcement._id
  ).populate("createdBy", "name email role");

  res.json({
    success: true,
    message: "Announcement updated successfully",
    data: populatedAnnouncement,
  });
});

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Crew only)
const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  // Check if user created this announcement or is admin
  if (
    announcement.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this announcement");
  }

  await Announcement.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Announcement deleted successfully",
  });
});

// @desc    Mark announcement as read
// @route   POST /api/announcements/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    res.status(404);
    throw new Error("Announcement not found");
  }

  await announcement.markAsRead(req.user.id);

  res.json({
    success: true,
    message: "Announcement marked as read",
  });
});

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats
// @access  Private (Crew only)
const getAnnouncementStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "crew" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view statistics");
  }

  const stats = await Announcement.aggregate([
    {
      $group: {
        _id: null,
        totalAnnouncements: { $sum: 1 },
        activeAnnouncements: {
          $sum: { $cond: ["$isActive", 1, 0] },
        },
        totalSent: { $sum: "$statistics.totalSent" },
        totalRead: { $sum: "$statistics.totalRead" },
      },
    },
  ]);

  const typeStats = await Announcement.aggregate([
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
      },
    },
  ]);

  const priorityStats = await Announcement.aggregate([
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalAnnouncements: 0,
        activeAnnouncements: 0,
        totalSent: 0,
        totalRead: 0,
      },
      byType: typeStats,
      byPriority: priorityStats,
    },
  });
});

// @desc    Get live feed announcements
// @route   GET /api/announcements/live-feed
// @access  Private
const getLiveFeed = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const announcements = await Announcement.find({
    isActive: true,
    $or: [
      { scheduledFor: { $exists: false } },
      { scheduledFor: { $lte: new Date() } },
    ],
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  })
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: announcements.length,
    data: announcements,
  });
});

module.exports = {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
  getAnnouncementStats,
  getLiveFeed,
};
