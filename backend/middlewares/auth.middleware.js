const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Verify JWT
const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.access_token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hackathon_secret");
    req.user = decoded; // contains id & email
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Ensure admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Error verifying admin role" });
  }
};

module.exports = { verifyToken, isAdmin };
