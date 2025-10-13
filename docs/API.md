# Battery Monitoring System - API Documentation

## Overview

RESTful API dan WebSocket endpoints untuk Battery Monitoring System.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently no authentication required. Add JWT middleware jika diperlukan keamanan tambahan.

---

## REST API Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if API is running

**Response:**

```json
{
  "success": true,
  "message": "BMS API is running",
  "timestamp": 1697289600000
}
```

---

### 2. Get Latest Battery Data

**Endpoint:** `GET /api/battery/latest`

**Query Parameters:**

- `limit` (optional): Number of records to return (default: 10)

**Example Request:**

```bash
curl http://localhost:3000/api/battery/latest?limit=5
```

**Response:**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "-NxYZ123",
      "voltage": 12.5,
      "current": 2.3,
      "temperature": 25.5,
      "soc": 85,
      "status": "charging",
      "timestamp": 1697289600000,
      "dateTime": "2025-10-14T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Last Month Data

**Endpoint:** `GET /api/battery/last-month`

**Description:** Retrieve all battery data from the last 30 days

**Example Request:**

```bash
curl http://localhost:3000/api/battery/last-month
```

**Response:**

```json
{
  "success": true,
  "count": 8640,
  "data": [...],
  "period": "30 days"
}
```

---

### 4. Get Data by Date Range

**Endpoint:** `GET /api/battery/range`

**Query Parameters:**

- `startDate` (required): ISO date string (e.g., "2025-01-01")
- `endDate` (required): ISO date string (e.g., "2025-01-31")

**Example Request:**

```bash
curl "http://localhost:3000/api/battery/range?startDate=2025-10-01&endDate=2025-10-14"
```

**Response:**

```json
{
  "success": true,
  "count": 1200,
  "data": [...],
  "period": {
    "start": "2025-10-01T00:00:00.000Z",
    "end": "2025-10-14T23:59:59.999Z"
  }
}
```

---

### 5. Export Data to CSV

**Endpoint:** `GET /api/battery/export-csv`

**Description:** Download battery data from last 30 days as CSV file

**Example Request:**

```bash
curl -O http://localhost:3000/api/battery/export-csv
```

**Response:** CSV file download

```csv
ID,Timestamp,Date Time,Voltage,Current,Temperature,SOC,Status
-NxYZ123,1697289600000,2025-10-14T10:30:00.000Z,12.5,2.3,25.5,85,charging
...
```

**Response Headers:**

```
Content-Type: text/csv
Content-Disposition: attachment; filename=battery-data-1697289600000.csv
```

---

### 6. System Status

**Endpoint:** `GET /api/battery/status`

**Description:** Get system status including MQTT, WebSocket, and server info

**Example Request:**

```bash
curl http://localhost:3000/api/battery/status
```

**Response:**

```json
{
  "success": true,
  "status": {
    "mqtt": {
      "connected": true,
      "config": {
        "server": "b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud",
        "port": 8883,
        "topic": "baterai/perintah"
      }
    },
    "websocket": {
      "connectedClients": 3
    },
    "server": {
      "uptime": 3600,
      "memory": {
        "rss": 52428800,
        "heapTotal": 20971520,
        "heapUsed": 15728640,
        "external": 1048576
      },
      "timestamp": 1697289600000
    }
  }
}
```

---

## WebSocket API

### Connection

**URL:** `ws://localhost:3000` or `http://localhost:3000`

**Client Example (JavaScript):**

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket", "polling"],
});
```

---

### Events

#### Client → Server

##### 1. Connection

Automatically triggered when client connects

**Event:** `connection`

**Server Response:**

```javascript
socket.on("connected", (data) => {
  console.log(data);
  // {
  //   message: 'Connected to BMS WebSocket Server',
  //   clientId: 'abc123',
  //   timestamp: 1697289600000
  // }
});
```

##### 2. Request Latest Data

Request the latest battery data

**Event:** `request-latest-data`

**Example:**

```javascript
socket.emit("request-latest-data");
```

---

#### Server → Client

##### 1. Battery Data (Real-time)

Receives new battery data whenever MQTT message arrives

**Event:** `battery-data`

**Example:**

```javascript
socket.on("battery-data", (data) => {
  console.log("New data:", data);
  // {
  //   voltage: 12.5,
  //   current: 2.3,
  //   temperature: 25.5,
  //   soc: 85,
  //   status: 'charging',
  //   timestamp: 1697289600000,
  //   dateTime: '2025-10-14T10:30:00.000Z',
  //   serverTimestamp: 1697289600500
  // }
});
```

##### 2. System Notification

Receives system notifications

**Event:** `notification`

**Example:**

```javascript
socket.on("notification", (notification) => {
  console.log(notification);
  // {
  //   message: 'MQTT connection lost',
  //   type: 'error',
  //   timestamp: 1697289600000
  // }
});
```

**Notification Types:**

- `info` - Informational messages
- `warning` - Warning messages
- `error` - Error messages

##### 3. Connection Status

Receives service connection status updates

**Event:** `connection-status`

**Example:**

```javascript
socket.on("connection-status", (status) => {
  console.log(status);
  // {
  //   service: 'mqtt',
  //   status: true,
  //   timestamp: 1697289600000
  // }
});
```

##### 4. Disconnect

Triggered when connection is closed

**Event:** `disconnect`

**Example:**

```javascript
socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

---

## Data Models

### Battery Data Object

```typescript
{
  id: string,              // Unique ID from Firebase
  voltage: number,         // Battery voltage (V)
  current: number,         // Battery current (A)
  temperature: number,     // Battery temperature (°C)
  soc: number,            // State of Charge (%)
  status: string,         // Battery status (charging, discharging, idle)
  timestamp: number,      // Unix timestamp (ms)
  dateTime: string        // ISO 8601 date string
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)",
  "timestamp": 1697289600000
}
```

### Common HTTP Status Codes

| Code | Description                      |
| ---- | -------------------------------- |
| 200  | Success                          |
| 400  | Bad Request - Invalid parameters |
| 404  | Not Found - No data available    |
| 500  | Internal Server Error            |

---

## Rate Limiting

Currently no rate limiting implemented. Add `express-rate-limit` if needed.

---

## Examples

### Frontend Integration (React)

```javascript
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

function BatteryMonitor() {
  const [batteryData, setBatteryData] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io("http://localhost:3000");

    newSocket.on("connected", (data) => {
      console.log("Connected:", data.clientId);
    });

    newSocket.on("battery-data", (data) => {
      setBatteryData(data);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  // Fetch historical data
  const fetchLastMonthData = async () => {
    const response = await fetch(
      "http://localhost:3000/api/battery/last-month"
    );
    const data = await response.json();
    return data;
  };

  // Export CSV
  const exportCSV = () => {
    window.open("http://localhost:3000/api/battery/export-csv", "_blank");
  };

  return (
    <div>
      <h1>Battery Monitor</h1>
      {batteryData && (
        <div>
          <p>Voltage: {batteryData.voltage}V</p>
          <p>Current: {batteryData.current}A</p>
          <p>Temperature: {batteryData.temperature}°C</p>
          <p>SOC: {batteryData.soc}%</p>
        </div>
      )}
      <button onClick={exportCSV}>Export CSV</button>
    </div>
  );
}
```

---

## Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Get latest data
curl http://localhost:3000/api/battery/latest?limit=5

# Get last month data
curl http://localhost:3000/api/battery/last-month

# Get data by range
curl "http://localhost:3000/api/battery/range?startDate=2025-10-01&endDate=2025-10-14"

# Download CSV
curl -O http://localhost:3000/api/battery/export-csv

# System status
curl http://localhost:3000/api/battery/status
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "BMS API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Latest Data",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/battery/latest?limit=10"
      }
    }
  ]
}
```

---

**Last Updated:** October 14, 2025
