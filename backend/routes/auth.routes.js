const express = require("express");
const { signup, login, me, logout } = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();

// Auth routes
router.post("/signup", signup);       // Register new user
router.post("/login", login);         // Login
router.get("/me", verifyToken, me);   // Get logged-in user
router.post("/logout", verifyToken, logout); // Logout

module.exports = router;