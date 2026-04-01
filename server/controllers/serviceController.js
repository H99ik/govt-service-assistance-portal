const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");
const Notification = require("../models/Notification");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const sendSMS = require("../utils/sendSMS");

exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res
      .status(200)
      .json({ success: true, count: services.length, data: services });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch services", error: err.message });
  }
};

exports.createRequest = async (req, res) => {
  try {
    const { serviceType, description } = req.body;

    if (!serviceType) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const existingService = await Service.findById(serviceType);

    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    // generate unique tracking id INSIDE function
    const trackingId = "TRK-" + uuidv4().slice(0, 8).toUpperCase();

    // default flow
    let status = "Pending";

    // ADMIN AUTO APPROVE
    if (req.user.role === "admin") {
      status = "In Progress";
    }

    const newRequest = new ServiceRequest({
      citizen: req.user._id,
      serviceType,
      description,
      trackingId,
      status,
    });

    await newRequest.save();

    // IF ADMIN → generate certificate immediately
    if (req.user.role === "admin") {
      const populatedRequest = await ServiceRequest.findById(newRequest._id)
        .populate("citizen")
        .populate("serviceType");

      const cert = await generateCertificate(populatedRequest);

      newRequest.certificateId = cert.certificateId;
      newRequest.certificateUrl = cert.certificateUrl;

      await newRequest.save();
    }

    await Notification.create({
      user: req.user._id,
      message: `Your service request has been submitted successfully for ${existingService.name}.`,
    });

    // 🔥 Get user phone from DB
    const user = await User.findById(req.user._id);

    // 🔥 Send SMS automatically
    await sendSMS(
      user.phone,
      `Your request submitted successfully. Tracking ID: ${newRequest.trackingId}`,
    );

    res.status(201).json({
      success: true,
      data: newRequest,
    });
  } catch (err) {
    res.status(500).json({
      message: "Request failed",
      error: err.message,
    });
  }
};

exports.createService = async (req, res) => {
  try {
    const {
      name,
      description,
      requiredDocuments,
      estimatedTime,
      serviceCharge,
    } = req.body;

    const newService = new Service({
      name,
      description,
      requiredDocuments,
      estimatedTime,
      serviceCharge,
    });

    await newService.save();

    res.status(201).json({
      success: true,
      data: newService,
    });
  } catch (err) {
    res.status(500).json({
      message: "Service creation failed",
      error: err.message,
    });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      status: "Pending", agent: null, citizen: { $ne: req.user._id },
      $or: [{ agent: null }, { agent: { $exists: false } }],
    })
      .populate("citizen", "name email")
      .populate("serviceType");

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not fetch pending requests",
      error: err.message,
    });
  }
};

// accept request
exports.acceptRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({ message: "Request already processed" });
    }

    request.agent = req.user._id;
    request.status = "In Progress";

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request accepted successfully",
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not accept request",
      error: err.message,
    });
  }
};

exports.getMyAssignedRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      agent: req.user._id,
      status: "In Progress",
    })
      .populate("citizen", "name email")
      .populate("serviceType");

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not fetch assigned requests",
      error: err.message,
    });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await ServiceRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    request.documents.push(req.file.filename);

    await request.save();

    res.json({
      message: "Document uploaded successfully",
      data: request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};

const generateCertificate = async (request) => {
  const certificateId = "CERT-" + uuidv4().slice(0, 8).toUpperCase();

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "certificates",
    `${certificateId}.pdf`,
  );

  const qrData = `http://localhost:5173/verify/${certificateId}`;
  const qrImage = await QRCode.toDataURL(qrData);

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  doc.pipe(fs.createWriteStream(filePath));

  // BORDER
  doc.rect(20, 20, 555, 800).stroke();

  // HEADER
  doc.fontSize(20).text("GOVERNMENT OF INDIA", { align: "center" });

  doc.fontSize(14).text("Government Service Portal", { align: "center" });

  doc.moveDown(2);

  // TITLE
  doc.fontSize(18).text("CERTIFICATE OF APPROVAL", {
    align: "center",
    underline: true,
  });

  doc.moveDown(2);

  // BODY TEXT
  doc
    .fontSize(12)
    .text(
      `This is to certify that the request submitted by the citizen has been successfully verified and approved by the authority.`,
      { align: "center" },
    );

  doc.moveDown(2);

  // DETAILS
  doc.fontSize(12).text(`Citizen Name: ${request.citizen.name}`);
  doc.text(`Service: ${request.serviceType.name}`);
  doc.text(`Tracking ID: ${request.trackingId}`);
  doc.text(`Certificate ID: ${certificateId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown(3);

  // SIGNATURE
  doc.text("Authorized Signature", { align: "right" });

  doc.moveDown(2);

  // QR CODE CENTER
  doc.image(qrImage, {
    fit: [100, 100],
    align: "center",
  });

  doc.end();

  return {
    certificateId,
    certificateUrl: `uploads/certificates/${certificateId}.pdf`,
  };
};

exports.verifyCertificate = async (req, res) => {
  try {
    const cert = await ServiceRequest.findOne({
      certificateId: req.params.certificateId,
    }).populate("citizen serviceType");

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Invalid Certificate",
      });
    }

    res.json({
      success: true,
      data: cert,
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
      error: error.message,
    });
  }
};

// Get All Active service
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      citizen: req.user._id, // use _id since you're attaching full user
    }).populate("serviceType"); // correct field name

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not fetch your requests",
      error: err.message,
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate("citizen", "name email")
      .populate("serviceType");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const allowedStatuses = [
      "Pending",
      "In Progress",
      "SubmittedToAdmin",
      "Completed",
      "Rejected",
    ];

    if (!allowedStatuses.includes(req.body.status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    // Agent cannot complete directly
    if (req.body.status === "Completed" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can complete the request",
      });
    }

    // Agent submits to admin
    if (req.body.status === "SubmittedToAdmin") {
      if (!request.documents || request.documents.length === 0) {
        return res.status(400).json({
          message: "Documents must be uploaded before submitting to admin",
        });
      }
    }

    // ADMIN DIRECT COMPLETE (from In Progress)
    if (req.user.role === "admin" && req.body.status === "Completed") {
      if (!request.documents || request.documents.length === 0) {
        return res.status(400).json({
          message: "Upload documents before completing request",
        });
      }
    }

    request.status = req.body.status;

    if (req.body.status === "Completed" && req.user.role === "admin") {
      const cert = await generateCertificate(request);

      request.certificateId = cert.certificateId;
      request.certificateUrl = cert.certificateUrl;
    }

    await request.save();

    res.status(200).json({
      success: true,
      message: "Request status updated",
      data: request,
    });
  } catch (err) {
    res.status(500).json({
      message: "Could not update status",
      error: err.message,
    });
  }
};

exports.getRequestsForAdmin = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      status: { $in: ["SubmittedToAdmin", "In Progress"] },
    })
      .populate("citizen", "name email")
      .populate("serviceType")
      .select("+documents"); // exclude heavy fields

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch admin requests",
      error: error.message,
    });
  }
};

exports.trackRequest = async (req, res) => {
  try {
    const request = await ServiceRequest.findOne({
      trackingId: req.params.trackingId,
    }).populate("serviceType");

    if (!request) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments();
    const completed = await ServiceRequest.countDocuments({
      status: "Completed",
    });

    const pending = await ServiceRequest.countDocuments({ status: "Pending" });
    const inProgress = await ServiceRequest.countDocuments({
      status: "In Progress",
    });

    const users = await User.countDocuments();

    res.json({
      totalRequests,
      completed,
      pending,
      inProgress,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
