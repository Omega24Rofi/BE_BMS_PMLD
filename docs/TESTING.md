# MQTT Test Data Generator

Kirim test data ke MQTT broker untuk testing.

## Menggunakan MQTT.fx atau MQTTX

### Connection Settings:

- **Broker**: b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud
- **Port**: 8883
- **Protocol**: mqtts (SSL/TLS)
- **Username**: coba1
- **Password**: IsaMaliki12

### Topic untuk Publish:

```
baterai/perintah
```

### Sample Payloads:

#### Normal Charging

```json
{
  "voltage": 12.5,
  "current": 2.3,
  "temperature": 25.5,
  "soc": 85,
  "status": "charging"
}
```

#### Discharging

```json
{
  "voltage": 11.8,
  "current": -1.5,
  "temperature": 28.0,
  "soc": 65,
  "status": "discharging"
}
```

#### Idle

```json
{
  "voltage": 12.6,
  "current": 0.1,
  "temperature": 24.0,
  "soc": 100,
  "status": "idle"
}
```

#### High Temperature Warning

```json
{
  "voltage": 12.2,
  "current": 3.5,
  "temperature": 45.0,
  "soc": 70,
  "status": "charging"
}
```

#### Low Battery

```json
{
  "voltage": 10.5,
  "current": -2.0,
  "temperature": 26.0,
  "soc": 15,
  "status": "discharging"
}
```

## Using Node.js Script

Create a test script to continuously send data:

```javascript
const mqtt = require("mqtt");

const client = mqtt.connect(
  "mqtts://b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud:8883",
  {
    username: "coba1",
    password: "IsaMaliki12",
  }
);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Send data every 5 seconds
  setInterval(() => {
    const data = {
      voltage: (Math.random() * 2 + 11).toFixed(2),
      current: (Math.random() * 5).toFixed(2),
      temperature: (Math.random() * 10 + 20).toFixed(1),
      soc: Math.floor(Math.random() * 100),
      status: ["charging", "discharging", "idle"][
        Math.floor(Math.random() * 3)
      ],
    };

    client.publish("baterai/perintah", JSON.stringify(data));
    console.log("Published:", data);
  }, 5000);
});
```

## Using Python Script

```python
import paho.mqtt.client as mqtt
import json
import time
import random

broker = "b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud"
port = 8883
username = "coba1"
password = "IsaMaliki12"
topic = "baterai/perintah"

client = mqtt.Client()
client.username_pw_set(username, password)
client.tls_set()

client.connect(broker, port)

while True:
    data = {
        "voltage": round(random.uniform(11, 13), 2),
        "current": round(random.uniform(0, 5), 2),
        "temperature": round(random.uniform(20, 30), 1),
        "soc": random.randint(0, 100),
        "status": random.choice(["charging", "discharging", "idle"])
    }

    client.publish(topic, json.dumps(data))
    print(f"Published: {data}")
    time.sleep(5)
```
