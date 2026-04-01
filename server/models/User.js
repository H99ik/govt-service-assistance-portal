const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false, // This hides the password by default when we get user data
  },

  phone: {
    type: String,
    required: [true, "Please add a mobile number"],
  },

  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    enum: ["citizen", "agent", "admin"],
    default: "citizen",
  },
  // Only for Agents

  isVerifiedAgent: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    default: null,
    index: { expires: 0 },
  },

  otpAttempts: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("User", UserSchema);
