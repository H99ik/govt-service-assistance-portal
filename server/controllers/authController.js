const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user in DB
    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ success: true, message: "User created!" });
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
    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8d",
    });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.log("FULL ERROR LOG:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
