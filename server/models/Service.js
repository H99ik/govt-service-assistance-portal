const mongoose = require("mongoose");
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredDocuments: [
      {
        type: String,
      },
    ],
    estimatedTime: {
      type: String,
    },
    serviceCharge: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
const ServiceRequestSchema = new mongoose.Schema({
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned later
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
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
exports.ServiceRequestSchema = ServiceRequestSchema;
