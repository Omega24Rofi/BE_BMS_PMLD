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

#### Full Battery (100%)

```json
{
  "voltage": 52.0,
  "percentage": 100
}
```

#### High Battery (75%)

```json
{
  "voltage": 48.5,
  "percentage": 75
}
```

#### Medium Battery (50%)

```json
{
  "voltage": 47.0,
  "percentage": 50
}
```

#### Low Battery (25%)

```json
{
  "voltage": 45.5,
  "percentage": 25
}
```

#### Critical Low Battery (10%)

````json
{
  "voltage": 44.2,
  "percentage": 10
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
      voltage: parseFloat((Math.random() * 8 + 44).toFixed(2)), // 44-52V
      percentage: Math.floor(Math.random() * 101), // 0-100%
    };

    client.publish("baterai/perintah", JSON.stringify(data));
    console.log("Published:", data);
  }, 5000);
});
````

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
voltage: (Math.random() _ 2 + 11).toFixed(2),
current: (Math.random() _ 5).toFixed(2),
temperature: (Math.random() _ 10 + 20).toFixed(1),
soc: Math.floor(Math.random() _ 100),
status: ["charging", "discharging", "idle"][ Math.floor(Math.random() * 3) ],
};

    client.publish("baterai/perintah", JSON.stringify(data));
    console.log("Published:", data);

}, 5000);
});

````

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
        "voltage": round(random.uniform(44, 52), 2),
        "percentage": random.randint(0, 100)
    }

    client.publish(topic, json.dumps(data))
    print(f"Published: {data}")
    time.sleep(5)
````
