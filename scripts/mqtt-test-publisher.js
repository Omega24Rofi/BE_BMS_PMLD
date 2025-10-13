const mqtt = require("mqtt");

// MQTT Configuration (from config file)
const config = {
  mqtt_server: "b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud",
  mqtt_user: "coba1",
  mqtt_pass: "IsaMaliki12",
  mqtt_port: 8883,
  pub_topic: "baterai/perintah",
};

// Connect to MQTT broker
const client = mqtt.connect(
  `mqtts://${config.mqtt_server}:${config.mqtt_port}`,
  {
    username: config.mqtt_user,
    password: config.mqtt_pass,
    rejectUnauthorized: true,
  }
);

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");
  console.log(`📡 Publishing to topic: ${config.pub_topic}`);
  console.log("🔄 Sending test data every 5 seconds...\n");

  let counter = 1;

  // Send test data every 5 seconds
  setInterval(() => {
    // Generate random but realistic battery data
    // Voltage range: 44V - 52V (typical for 48V battery system)
    // Percentage: 0-100%
    const data = {
      voltage: parseFloat((Math.random() * 8 + 44).toFixed(2)), // 44-52V
      percentage: Math.floor(Math.random() * 101), // 0-100%
    };

    client.publish(
      config.pub_topic,
      JSON.stringify(data),
      { qos: 1 },
      (err) => {
        if (err) {
          console.error("❌ Publish error:", err);
        } else {
          console.log(`[${counter}] 📤 Published:`, data);
          counter++;
        }
      }
    );
  }, 5000);
});

client.on("error", (error) => {
  console.error("❌ MQTT Error:", error);
});

client.on("close", () => {
  console.log("🔌 Connection closed");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Stopping test data generator...");
  client.end();
  process.exit(0);
});
