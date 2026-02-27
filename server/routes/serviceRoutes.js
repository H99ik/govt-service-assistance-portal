const express = require("express");
const router = express.Router();

const serviceController = require("../controllers/serviceController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const agentMiddleware = require("../middleware/agentMiddleware");

// User routes
router.post("/request", protect, serviceController.createRequest);
router.get("/my-requests", protect, serviceController.getMyRequests);

// Public route
router.get("/", serviceController.getActiveServices);

// Admin route
router.post("/", protect, adminMiddleware, serviceController.createService);

//pending: agent route to update request status
router.get("/pending", protect, agentMiddleware, serviceController.getPendingRequests);
router.put("/accept/:id", protect, agentMiddleware, serviceController.acceptRequest);


module.exports = router;