const agentMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "agent") {
    next();
  } else {
    res.status(403).json({ message: "Agent access required" });
  }
};

module.exports = agentMiddleware;
