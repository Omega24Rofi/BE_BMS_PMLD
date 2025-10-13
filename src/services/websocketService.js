const { Server } = require("socket.io");

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedClients = new Set();
  }

  /**
   * Initialize Socket.IO server
   * @param {Object} server - HTTP server instance
   */
  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "*", // Allow all origins or specific frontend URL
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupEventHandlers();
    console.log("✅ WebSocket service initialized");
  }

  /**
   * Setup Socket.IO event handlers
   */
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      this.connectedClients.add(socket.id);
      console.log(
        `🔌 Client connected: ${socket.id} | Total clients: ${this.connectedClients.size}`
      );

      // Send welcome message
      socket.emit("connected", {
        message: "Connected to BMS WebSocket Server",
        clientId: socket.id,
        timestamp: Date.now(),
      });

      // Handle client requesting latest data
      socket.on("request-latest-data", async () => {
        console.log(`📡 Client ${socket.id} requested latest data`);
        // This will be handled by the controller
        socket.emit("request-received", { message: "Fetching latest data..." });
      });

      // Handle client disconnect
      socket.on("disconnect", () => {
        this.connectedClients.delete(socket.id);
        console.log(
          `🔌 Client disconnected: ${socket.id} | Total clients: ${this.connectedClients.size}`
        );
      });

      // Handle errors
      socket.on("error", (error) => {
        console.error(`❌ Socket error for client ${socket.id}:`, error);
      });
    });
  }

  /**
   * Broadcast battery data to all connected clients
   * @param {Object} data - Battery data to broadcast
   */
  broadcastBatteryData(data) {
    if (!this.io) {
      console.error("❌ WebSocket not initialized");
      return;
    }

    const payload = {
      ...data,
      serverTimestamp: Date.now(),
    };

    this.io.emit("battery-data", payload);
    console.log(
      `📡 Broadcasting data to ${this.connectedClients.size} clients`
    );
  }

  /**
   * Send battery data to specific client
   * @param {string} socketId - Socket ID of the client
   * @param {Object} data - Battery data to send
   */
  sendToClient(socketId, data) {
    if (!this.io) {
      console.error("❌ WebSocket not initialized");
      return;
    }

    this.io.to(socketId).emit("battery-data", data);
    console.log(`📡 Sent data to client: ${socketId}`);
  }

  /**
   * Broadcast system notification
   * @param {string} message - Notification message
   * @param {string} type - Notification type (info, warning, error)
   */
  broadcastNotification(message, type = "info") {
    if (!this.io) {
      console.error("❌ WebSocket not initialized");
      return;
    }

    this.io.emit("notification", {
      message,
      type,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast connection status
   * @param {string} service - Service name (mqtt, firebase)
   * @param {boolean} status - Connection status
   */
  broadcastConnectionStatus(service, status) {
    if (!this.io) {
      console.error("❌ WebSocket not initialized");
      return;
    }

    this.io.emit("connection-status", {
      service,
      status,
      timestamp: Date.now(),
    });
  }

  /**
   * Get number of connected clients
   * @returns {number} - Number of connected clients
   */
  getConnectedClientsCount() {
    return this.connectedClients.size;
  }

  /**
   * Get Socket.IO instance
   * @returns {Object} - Socket.IO instance
   */
  getIO() {
    return this.io;
  }
}

module.exports = new WebSocketService();
