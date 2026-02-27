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
