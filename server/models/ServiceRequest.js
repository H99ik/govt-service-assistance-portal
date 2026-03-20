const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema(
  {
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned later
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "SubmittedToAdmin",
        "Completed",
        "Rejected",
      ],
      default: "Pending",
    },
    documents: [String], // Array of file paths from Multer

    description: String,

    trackingId: {
      type: String,
      unique: true,
      default: () => "TRK-" + uuidv4().slice(0, 8).toUpperCase(),
    },

    certificateUrl: {
      type: String,
    },

    certificateId: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
