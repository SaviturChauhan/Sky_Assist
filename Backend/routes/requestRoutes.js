const express = require("express");
const {
  getRequests,
  getRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  addMessage,
  getRequestStats,
} = require("../controllers/requestController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes are protected
router.use(protect);

// Public request routes
router.route("/").get(getRequests).post(createRequest);

router.route("/stats").get(authorize("crew", "admin"), getRequestStats);

router.route("/:id").get(getRequest).put(updateRequest).delete(deleteRequest);

router.route("/:id/messages").post(addMessage);

module.exports = router;
