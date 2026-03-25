const express = require("express");
const router = express.Router();
const { register,login } = require("../controllers/authController");
const { getAllRequests, updateRequestStatus} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");
const authController = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// Both 'protect' (logged in) AND 'adminProtect' (must be admin)
router.get("/all-requests", protect, adminProtect, getAllRequests);
router.put("/update/:id", protect, adminProtect, updateRequestStatus);
router.post("/verify-otp", authController.verifyOTP);


module.exports = router;
