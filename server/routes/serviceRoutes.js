const express = require("express");
const router = express.Router();
const { createRequest } = require("../controllers/serviceController");
const ServiceRequest = require("../model/ServiceRequest");
const { protect } = require("../middleware/authMiddleware");
const { getMyRequests } = require("../controllers/serviceController");

// In a real app, we would add "protect" middleware here to ensure only logged-in users can request
router.post("/request", protect, createRequest);
router.get("/my-requests", protect, getMyRequests);

module.exports = router;
