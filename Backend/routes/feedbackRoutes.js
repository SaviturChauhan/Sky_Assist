const express = require("express");
const {
  createFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
} = require("../controllers/feedbackController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Public feedback routes
router.route("/").get(getFeedback).post(createFeedback);

// Statistics route (Crew/Admin only)
router.route("/stats").get(authorize("crew", "admin"), getFeedbackStats);

// Individual feedback routes
router
  .route("/:id")
  .get(getFeedbackById)
  .put(updateFeedback)
  .delete(deleteFeedback);

module.exports = router;

