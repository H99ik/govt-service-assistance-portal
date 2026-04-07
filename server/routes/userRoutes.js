const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");

const { getAllUsers, updateUserRole, deleteUser, getProfile, updateProfile, changePassword } = require("../controllers/userController");

// GET all users (admin only)
router.get("/", protect, adminProtect, getAllUsers);
router.put("/:id/role", protect, adminProtect, updateUserRole);
router.delete("/:id", protect, adminProtect, deleteUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;