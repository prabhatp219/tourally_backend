// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    // payload should contain at least user id, e.g. { id: user._id }
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ message: "Invalid token" });

    // attach user object (id + role + other non-sensitive fields)
    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message || err);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

const adminCheck = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only." });
  next();
};

module.exports = { auth, adminCheck };
 