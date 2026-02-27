const express = require("express");
const router = express.Router();
const { register,login } = require("../controllers/authController");
const { getAllRequests, updateRequestStatus} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminProtect = require("../middleware/adminMiddleware");

router.post("/register", register);
router.post("/login", login);

// Both 'protect' (logged in) AND 'adminProtect' (must be admin)
router.get("/all-requests", protect, adminProtect, getAllRequests);
router.put("/update/:id", protect, adminProtect, updateRequestStatus);


module.exports = router;
