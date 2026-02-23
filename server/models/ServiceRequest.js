const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned later
  serviceType: {
    type: String,
    enum: [
      "Birth Certificate",
      "Income Certificate",
      "Caste Certificate",
      "Domicile Certificate",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Rejected"],
    default: "Pending",
  },
  documents: [String], // Array of file paths from Multer
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
