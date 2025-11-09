const asyncHandler = require("express-async-handler");
const Request = require("../models/requestModel");

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
const getRequests = asyncHandler(async (req, res) => {
  const {
    status,
    category,
    priority,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter object
  const filter = {};

  // If user is passenger, only show their requests
  if (req.user.role === "passenger") {
    filter.passenger = req.user.id;
  }

  // Add status filter
  if (status && status !== "All") {
    filter.status = status;
  }

  // Add category filter
  if (category && category !== "All") {
    filter.category = category;
  }

  // Add priority filter
  if (priority && priority !== "All") {
    filter.priority = priority;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  const requests = await Request.find(filter)
    .populate("passenger", "name email seatNumber")
    .populate("assignedTo", "name email")
    .sort(sort);

  res.json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
const getRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id)
    .populate("passenger", "name email seatNumber")
    .populate("assignedTo", "name email");

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Check if user can access this request
  if (
    req.user.role === "passenger" &&
    request.passenger._id.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to access this request");
  }

  res.json({
    success: true,
    data: request,
  });
});

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
const createRequest = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      seatNumber,
      flightNumber,
      location,
    } = req.body;

    console.log("Creating request:", {
      userId: req.user.id,
      userEmail: req.user.email,
      title,
      category,
      priority,
    });

    // Validate required fields
    if (!title || !category) {
      res.status(400);
      throw new Error("Title and category are required");
    }

    console.log("Request data validated, creating in database...");

    const request = await Request.create({
      passenger: req.user.id,
      title,
      description,
      category,
      priority: priority || "Medium",
      seatNumber: seatNumber || req.user.seatNumber,
      flightNumber: flightNumber || req.user.flightNumber,
      location,
      status: "New",
    });

    console.log("Request created successfully:", request._id);

    const populatedRequest = await Request.findById(request._id).populate(
      "passenger",
      "name email seatNumber"
    );

    console.log("Request populated, sending response");

    res.status(201).json({
      success: true,
      message: "Request created successfully",
      data: populatedRequest,
    });
  } catch (error) {
    console.error("Error creating request:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
});

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
const updateRequest = asyncHandler(async (req, res) => {
  let request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Check authorization
  if (
    req.user.role === "passenger" &&
    request.passenger.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to update this request");
  }

  // Log the update for debugging
  console.log(`[UPDATE REQUEST] ID: ${req.params.id}, User: ${req.user.role}, Updates:`, req.body);

  // Only allow certain fields to be updated by passengers
  if (req.user.role === "passenger") {
    const allowedUpdates = ["title", "description", "priority", "location"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    request = await Request.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
  } else {
    // Crew can update all fields including status
    request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  // Verify the update was saved
  const updatedRequest = await Request.findById(req.params.id);
  console.log(`[UPDATE REQUEST] After save - Status: ${updatedRequest.status}`);

  const populatedRequest = await Request.findById(request._id)
    .populate("passenger", "name email seatNumber")
    .populate("assignedTo", "name email");

  res.json({
    success: true,
    message: "Request updated successfully",
    data: populatedRequest,
  });
});

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
const deleteRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  // Only passengers can delete their own requests, or crew can delete any
  if (
    req.user.role === "passenger" &&
    request.passenger.toString() !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this request");
  }

  await Request.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Request deleted successfully",
  });
});

// @desc    Add chat message to request
// @route   POST /api/requests/:id/messages
// @access  Private
const addMessage = asyncHandler(async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Adding message to request:", {
      requestId: req.params.id,
      userId: req.user.id,
      userRole: req.user.role,
      message: message?.substring(0, 50) + "...",
    });

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message is required");
    }

    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error("Request not found");
    }

    // Check authorization
    if (
      req.user.role === "passenger" &&
      request.passenger.toString() !== req.user.id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized to add message to this request");
    }

    const newMessage = {
      sender: req.user.role,
      senderId: req.user.id,
      message: message.trim(),
      timestamp: new Date(),
    };

    console.log("Creating message object:", newMessage);

    request.chatMessages.push(newMessage);
    await request.save();

    console.log("Message saved successfully. Request now has", request.chatMessages.length, "messages");

    // Return the saved message with populated sender info
    const savedMessage = request.chatMessages[request.chatMessages.length - 1];

    res.json({
      success: true,
      message: "Message added successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    console.error("Error stack:", error.stack);
    throw error;
  }
});

// @desc    Get request statistics
// @route   GET /api/requests/stats
// @access  Private (Crew only)
const getRequestStats = asyncHandler(async (req, res) => {
  if (req.user.role !== "crew" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view statistics");
  }

  const stats = await Request.aggregate([
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        newRequests: {
          $sum: { $cond: [{ $eq: ["$status", "New"] }, 1, 0] },
        },
        inProgressRequests: {
          $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] },
        },
        resolvedRequests: {
          $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] },
        },
        urgentRequests: {
          $sum: { $cond: [{ $eq: ["$priority", "Urgent"] }, 1, 0] },
        },
      },
    },
  ]);

  const categoryStats = await Request.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      overview: stats[0] || {
        totalRequests: 0,
        newRequests: 0,
        inProgressRequests: 0,
        resolvedRequests: 0,
        urgentRequests: 0,
      },
      byCategory: categoryStats,
    },
  });
});

module.exports = {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  addMessage,
  getRequestStats,
};
