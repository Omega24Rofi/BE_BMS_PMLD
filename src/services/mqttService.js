const mqtt = require("mqtt");
const fs = require("fs");
const path = require("path");

class MqttService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.messageHandlers = [];
    this.config = this.loadConfig();
  }

  /**
   * Load MQTT configuration from JSON file
   */
  loadConfig() {
    try {
      const configPath = path.join(
        __dirname,
        "../../config/environments/mqtt-enviroment.json"
      );
      const configData = fs.readFileSync(configPath, "utf8");
      return JSON.parse(configData);
    } catch (error) {
      console.error("❌ Error loading MQTT config:", error);
      throw error;
    }
  }

  /**
   * Connect to MQTT broker
   */
  connect() {
    const { mqtt_server, mqtt_user, mqtt_pass, mqtt_port, sub_topic } =
      this.config;

    const options = {
      host: mqtt_server,
      port: mqtt_port,
      protocol: "mqtts", // Use mqtts for secure connection
      username: mqtt_user,
      password: mqtt_pass,
      reconnectPeriod: 5000, // Auto reconnect every 5 seconds
      connectTimeout: 30000,
      rejectUnauthorized: true,
    };

    console.log(`🔌 Connecting to MQTT broker: ${mqtt_server}:${mqtt_port}...`);

    this.client = mqtt.connect(options);

    // Event: Connection successful
    this.client.on("connect", () => {
      this.isConnected = true;
      console.log("✅ Connected to MQTT broker successfully!");

      // Subscribe to topic
      this.subscribe(sub_topic);
    });

    // Event: Receive message
    this.client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log(`📨 Received data from topic ${topic}:`, data);

        // Trigger all registered handlers
        this.messageHandlers.forEach((handler) => handler(topic, data));
      } catch (error) {
        console.error("❌ Error parsing MQTT message:", error);
      }
    });

    // Event: Connection error
    this.client.on("error", (error) => {
      console.error("❌ MQTT Connection Error:", error);
      this.isConnected = false;
    });

    // Event: Reconnecting
    this.client.on("reconnect", () => {
      console.log("🔄 Reconnecting to MQTT broker...");
    });

    // Event: Connection closed
    this.client.on("close", () => {
      console.log("🔌 MQTT connection closed");
      this.isConnected = false;
    });

    // Event: Offline
    this.client.on("offline", () => {
      console.log("📡 MQTT client is offline");
      this.isConnected = false;
    });
  }

  /**
   * Subscribe to MQTT topic
   * @param {string} topic - Topic to subscribe
   */
  subscribe(topic) {
    if (!this.client) {
      console.error("❌ MQTT client not initialized");
      return;
    }

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`❌ Failed to subscribe to topic ${topic}:`, err);
      } else {
        console.log(`✅ Successfully subscribed to topic: ${topic}`);
      }
    });
  }

  /**
   * Publish message to MQTT topic
   * @param {string} topic - Topic to publish
   * @param {Object|string} message - Message to publish
   */
  publish(topic, message) {
    if (!this.client || !this.isConnected) {
      console.error("❌ MQTT client not connected");
      return false;
    }

    const payload =
      typeof message === "string" ? message : JSON.stringify(message);

    this.client.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error(`❌ Failed to publish to topic ${topic}:`, err);
      } else {
        console.log(`✅ Message published to ${topic}:`, payload);
      }
    });

    return true;
  }

  /**
   * Register message handler
   * @param {Function} handler - Callback function to handle messages
   */
  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  /**
   * Unsubscribe from topic
   * @param {string} topic - Topic to unsubscribe
   */
  unsubscribe(topic) {
    if (!this.client) {
      console.error("❌ MQTT client not initialized");
      return;
    }

    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`❌ Failed to unsubscribe from topic ${topic}:`, err);
      } else {
        console.log(`✅ Successfully unsubscribed from topic: ${topic}`);
      }
    });
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
      console.log("🔌 Disconnected from MQTT broker");
    }
  }

  /**
   * Get connection status
   * @returns {boolean} - Connection status
   */
  getConnectionStatus() {
    return this.isConnected;
  }

  /**
   * Get MQTT configuration
   * @returns {Object} - MQTT configuration
   */
  getConfig() {
    return this.config;
  }
}

module.exports = new MqttService();
