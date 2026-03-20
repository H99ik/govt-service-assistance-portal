const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my", protect, notificationController.getMyNotifications);
router.put("/mark-read", protect, notificationController.markAsRead);

module.exports = router;
