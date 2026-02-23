const ServiceRequest = require("../models/ServiceRequest");

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

exports.getMyRequests = async (req, res) => {
  try {
    const request = await ServiceRequest.find({ citizen: req.user.id });

    res
      .status(200)
      .json({ success: true, count: request.length, data: request });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch your requests", error: err.message });
  }
};
