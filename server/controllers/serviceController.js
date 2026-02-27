const ServiceRequest = require("../models/ServiceRequest");
const Service = require("../models/Service");

exports.getActiveServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });   
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch services", error: err.message });
  } 
};

exports.createRequest = async (req, res) => {
  try {
    const { service, description } = req.body;

    // Check if service exists
    const existingService = await Service.findById(service);
    if (!existingService) {
      return res.status(404).json({ message: "Service not found" });
    }

    const newRequest = new ServiceRequest({
      citizen: req.user.id,
      service,
      description,
    });

    await newRequest.save();

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
    const { name, description, requiredDocuments, estimatedTime, serviceCharge } = req.body;

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
      agent: { $exists: false }
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

// Get All Active service 
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({
      citizen: req.user._id,   // use _id since you're attaching full user
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
