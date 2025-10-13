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
    const statuses = ["charging", "discharging", "idle"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate random but realistic battery data
    const data = {
      voltage: parseFloat((Math.random() * 2 + 11).toFixed(2)), // 11-13V
      current: parseFloat((Math.random() * 5).toFixed(2)), // 0-5A
      temperature: parseFloat((Math.random() * 10 + 20).toFixed(1)), // 20-30°C
      soc: Math.floor(Math.random() * 100), // 0-100%
      status: randomStatus,
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
