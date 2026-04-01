const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOTP,
  loginWithOtp,
  verifyLoginOtp,
  resendOtp,
} = require("../controllers/authController");

const {
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/verify-otp-login", verifyLoginOtp);
router.post("/login-otp", loginWithOtp);
router.post("/resend-otp", resendOtp);

// Admin routes
router.get("/all-requests", protect, adminProtect, getAllRequests);
router.put("/update/:id", protect, adminProtect, updateRequestStatus);

module.exports = router;
