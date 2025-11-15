// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { auth, adminCheck } = require("../middleware/auth");

// GET /api/admin/users  -> list all users (admins only)
router.get("/users", auth, adminCheck, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    console.error("admin/users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
