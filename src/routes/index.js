const express = require("express");
const router = express.Router();

// Import routes
const batteryRoutes = require("./batteryRoutes");

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BMS API is running",
    timestamp: Date.now(),
  });
});

// Battery routes
router.use("/battery", batteryRoutes);

module.exports = router;
