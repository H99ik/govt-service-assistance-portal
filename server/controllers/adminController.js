const ServiceRequest = require("../model/ServiceRequest");

// Get all certificate requests (Birth, Income, Caste, Domicile)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find().populate("citizen", "name email");
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update the status of a request
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let request = await ServiceRequest.findById(req.params.id);

    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    res.status(200).json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};