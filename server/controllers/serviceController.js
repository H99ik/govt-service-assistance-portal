const ServiceRequest = require("../model/ServiceRequest");

exports.createRequest = async (req, res) => {

  console.log("body received by server:", req.body);
  try {
    const { serviceType, description } = req.body;

    const newRequest = new ServiceRequest({
      citizen: req.user.id, // We will get this from the Login Token later
      serviceType,
      description,
    });

    await newRequest.save();
    res.status(201).json({ success: true, data: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Request failed", error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try{
    
    const request = await ServiceRequest.find({ citizen: req.user.id});
    
    res.status(200).json({ success: true, count: request.length, data: request});
  } catch (err){

    res.status(500).json({message: "Could not fetch your requests", error: err.message});
  }

};
