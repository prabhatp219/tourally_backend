// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://prabhat207:dQuaPuI7ScwvP0h2@cluster0.tzhv7ls.mongodb.net/')
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// ------------------ Signup Route ------------------
app.post("/api/signup", async (req, res) => {
  console.log("Signup request body:", req.body);

  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ message: "Username or Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ firstName, lastName, username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ------------------ Signin Route ------------------
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.status(200).json({ 
      message: "Login successful", 
      user: { 
        id: user._id, 
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
const PORT = process.env.PORT || 6000;
// Test route to check if server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
