const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my", protect, notificationController.getMyNotifications);

module.exports = router;