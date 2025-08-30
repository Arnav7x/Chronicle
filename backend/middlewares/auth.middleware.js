// This is an example of what your login function should look like.
// It might be in auth.routes.js or auth.controller.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Corrected part: create and set the token as a cookie
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "hackathon_secret",
      { expiresIn: "1h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", // Use 'none' for cross-site requests
    });

    res.status(200).json({ message: "Login successful", user });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ... export this function if it's in a controller
module.exports = { login };

// ... Or use it in your router like this
// const express = require('express');
// const router = express.Router();
// router.post('/login', login);