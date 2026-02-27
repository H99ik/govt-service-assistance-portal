const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User routes
router.post("/request", protect, serviceController.createRequest);
router.get("/my-requests", protect, serviceController.getMyRequests);

// Public route
router.get("/", serviceController.getActiveServices);

// Admin route
router.post("/", protect, adminMiddleware, serviceController.createService);

module.exports = router;