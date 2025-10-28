const express = require("express");
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAsRead,
  getAnnouncementStats,
  getLiveFeed,
} = require("../controllers/announcementController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Public announcement routes
router
  .route("/")
  .get(getAnnouncements)
  .post(authorize("crew", "admin"), createAnnouncement);

router.route("/live-feed").get(getLiveFeed);

router.route("/stats").get(authorize("crew", "admin"), getAnnouncementStats);

router
  .route("/:id")
  .get(getAnnouncement)
  .put(authorize("crew", "admin"), updateAnnouncement)
  .delete(authorize("crew", "admin"), deleteAnnouncement);

router.route("/:id/read").post(markAsRead);

module.exports = router;
