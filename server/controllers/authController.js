const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, adminSecret, agentSecret } = req.body;

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

    // 4. If admin secret matches, make admin

    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
      role = "admin";
    } else if (agentSecret && agentSecret === process.env.AGENT_SECRET) {
      role = "agent";
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 5. Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      otp,
      otpExpires: otpExpiry,
      isVerified: false,
    });

    await user.save();

    const sendSMS = require("../utils/sendSMS");

    await sendSMS(
      phone,
      `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
    );

    res.status(201).json({
      success: true,
      message: "OTP sent to your mobile. Please verify your account.",
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

    // 3. Create and send JWT
    const payload = { _id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};