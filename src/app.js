require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");

// Import middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

// Import services
const mqttService = require("./services/mqttService");
const firebaseService = require("./services/firebaseService");
const websocketService = require("./services/websocketService");

// Import routes
const routes = require("./routes");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Initialize WebSocket
websocketService.initialize(server);

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Battery Monitoring System API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      batteryData: "/api/battery/last-month",
      exportCSV: "/api/battery/export-csv",
      latest: "/api/battery/latest",
      status: "/api/battery/status",
    },
  });
});

app.use("/api", routes);

// Error handler (must be last)
app.use(errorHandler);

// Initialize MQTT connection and handle incoming data
console.log("🚀 Initializing Battery Monitoring System...\n");

// Connect to MQTT broker
mqttService.connect();

// Handle MQTT messages
mqttService.onMessage(async (topic, data) => {
  try {
    console.log(`\n📥 Processing data from topic: ${topic}`);

    // 1. Simpan ke Firebase Realtime Database
    const saveResult = await firebaseService.saveBatteryData(data);

    // 2. Kirim ke Frontend via WebSocket
    if (saveResult.success) {
      websocketService.broadcastBatteryData(saveResult.data);
    }

    console.log("✅ Data processing completed\n");
  } catch (error) {
    console.error("❌ Error processing MQTT message:", error);
    websocketService.broadcastNotification("Error processing data", "error");
  }
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n🛑 SIGTERM received. Shutting down gracefully...");
  mqttService.disconnect();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n🛑 SIGINT received. Shutting down gracefully...");
  mqttService.disconnect();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════");
  console.log(`🚀 BMS Server running in ${NODE_ENV} mode`);
  console.log(`📡 HTTP Server: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log("═══════════════════════════════════════════════\n");
});

module.exports = app;
