const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Default role
    let role = "citizen";

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 4. Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      otp,
      otpExpires: otpExpiry,
      isVerified: false,
      expiresAt: otpExpiry,
    });

    await user.save();

    const sendSMS = require("../utils/sendSMS");
    const sendEmail = require("../utils/sendEmail");

    if (process.env.NODE_ENV === "development") {
      console.log("📲 DEV OTP:", otp);
    } else {
      // 📱 SMS
      try {
        await sendSMS(
          phone,
          `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
        );
      } catch (err) {
        console.log("❌ SMS failed:", err.message);
      }

      // 📩 EMAIL
      try {
        await sendEmail(email, otp);
      } catch (err) {
        console.log("❌ Email failed:", err.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "OTP sent to your mobile. Please verify your account.",
      role: user.role,
    });
  } catch (err) {
    //res.status(500).json({ message: "Server error", error: err.message });
    console.log("🔥 REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Check if user exists
    const user = await User.findOne({ email }).select("+password");
    console.log("USER FOUND:", user);
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your account first" });
    }

    // 🔐 Step 2: Generate OTP (2FA)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    console.log("📲 LOGIN OTP:", otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your phone",
    });
  } catch (err) {
    console.log("FULL ERROR LOG:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // 🔒 BLOCK AFTER 3 ATTEMPTS
    if (user.otpAttempts >= 3) {
      return res.status(429).json({
        message: "Too many attempts. Try again later.",
      });
    }

    // ❌ WRONG OTP
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ⏰ EXPIRED
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    user.expiresAt = null;
    user.otpAttempts = 0;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginWithOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Account not verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("📲 LOGIN OTP:", otp);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    const sendSMS = require("../utils/sendSMS");

    if (!user.phone) {
      return res.status(400).json({ message: "Phone number not found" });
    }

    await sendSMS(
      user.phone,
      `Your OTP for login is ${otp}. It is valid for 10 minutes.`,
    );

    if (user.otpExpires && user.otpExpires > new Date()) {
      return res.status(400).json({
        message: "Please wait before requesting another OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP sent to your mobile. Please verify to login.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    let user;

    if (email) user = await User.findOne({ email });
    if (phone) user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔒 BLOCK AFTER 3 ATTEMPTS
    if (user.otpAttempts >= 3) {
      return res.status(429).json({
        message: "Too many attempts. Try again later.",
      });
    } else {
      user.otpAttempts = 0; // reset attempts on successful login
      await user.save();
    }

    // ❌ WRONG OTP
    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ⏰ EXPIRED
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ SUCCESS
    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    console.log("📲 RESEND OTP:", otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpiry;
    user.otpAttempts = 0;

    await user.save();

    console.log("🔑 RESET OTP:", otp);

    res.json({
      message: "OTP sent",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otpAttempts >= 3) {
      return res.status(429).json({
        message: "Too many attempts. Try again later.",
      });
    }

    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.otp = null;
    user.otpExpires = null;
    user.otpAttempts = 0;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);

      user.avatar = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({
        success: true,
        avatar: user.avatar,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload failed" });
    }
  },
];
