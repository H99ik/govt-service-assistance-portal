const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");
const Notification = require("../models/Notification");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

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

    const newRequest = new ServiceRequest({
      citizen: req.user._id,
      serviceType,
      description,
    });

    await newRequest.save();

    await Notification.create({
      user: req.user._id,
      message: `Your service request has been submitted successfully for ${existingService.name}.`,
    });

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
      status: "Pending",
      agent: { $exists: false },
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
  const certificateId = "CERT-" + uuidv4().slice(0, 8);

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    "certificates",
    `${certificateId}.pdf`,
  );

  const qrData = `http://localhost:5000/api/verify/${certificateId}`;
  const qrImage = await QRCode.toDataURL(qrData);

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Government Service Portal", { align: "center" });
  doc.moveDown();

  doc.fontSize(16).text("Certificate of Approval", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Citizen: ${request.citizen.name}`);
  doc.text(`Service: ${request.serviceType.name}`);
  doc.text(`Certificate ID: ${certificateId}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);

  doc.moveDown();

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
      status: "SubmittedToAdmin",
    })
      .populate("citizen", "name email")
      .populate("serviceType");

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
