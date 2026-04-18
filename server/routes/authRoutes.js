const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyOTP,
  loginWithOtp,
  verifyLoginOtp,
  resendOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/authController");

const {
  getAllRequests,
  updateRequestStatus,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");

const { uploadAvatar } = require("../controllers/authController");

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/verify-otp-login", verifyLoginOtp);
router.post("/login-otp", loginWithOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/upload-avatar", protect, uploadAvatar);

// Admin routes
router.get("/all-requests", protect, adminProtect, getAllRequests);
router.put("/update/:id", protect, adminProtect, updateRequestStatus);

module.exports = router;
