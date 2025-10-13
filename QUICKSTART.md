# 🚀 Quick Start Guide - Battery Monitoring System

## Langkah-langkah Setup Cepat

### 1️⃣ Prerequisites

Pastikan sudah terinstall:

- ✅ Node.js (v16+)
- ✅ npm atau yarn
- ✅ Git

### 2️⃣ Installation

```bash
# Clone repository (jika dari git)
git clone <your-repo-url>
cd BE_BMS

# Install dependencies
npm install
```

### 3️⃣ Configuration

#### A. Environment Variables

File `.env` sudah ada, pastikan isinya sesuai:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
FIREBASE_DATABASE_URL=https://bms-pmld-default-rtdb.firebaseio.com
```

#### B. MQTT Configuration

File `config/environments/mqtt-enviroment.json` sudah dikonfigurasi:

```json
{
  "mqtt_server": "b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud",
  "mqtt_user": "coba1",
  "mqtt_pass": "IsaMaliki12",
  "mqtt_port": 8883,
  "pub_topic": "baterai/status",
  "sub_topic": "baterai/perintah"
}
```

#### C. Firebase Admin SDK

File sudah ada di: `config/bms-pmld-firebase-adminsdk-fbsvc-afd823dc16.json`

### 4️⃣ Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server akan berjalan di: `http://localhost:3000`

### 5️⃣ Test Connection

#### A. Test REST API

Buka browser atau gunakan curl:

```bash
# Health check
curl http://localhost:3000/api/health

# System status
curl http://localhost:3000/api/battery/status
```

#### B. Test WebSocket

Buka browser console dan jalankan:

```javascript
const socket = io("http://localhost:3000");
socket.on("connected", (data) => console.log("Connected:", data));
socket.on("battery-data", (data) => console.log("Battery Data:", data));
```

### 6️⃣ Send Test Data

#### Option 1: Menggunakan Script

```bash
node scripts/mqtt-test-publisher.js
```

Script ini akan mengirim data test setiap 5 detik.

#### Option 2: Manual via MQTT Client

Gunakan MQTTX atau MQTT.fx:

- Broker: `b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud`
- Port: `8883`
- Topic: `baterai/perintah`
- Payload:

```json
{
  "voltage": 12.5,
  "current": 2.3,
  "temperature": 25.5,
  "soc": 85,
  "status": "charging"
}
```

### 7️⃣ Verify Data Flow

1. **Check Console Logs**

   ```
   ✅ Connected to MQTT broker successfully!
   📨 Received data from topic baterai/perintah
   ✅ Data berhasil disimpan ke Firebase
   📡 Broadcasting data to X clients
   ```

2. **Check Firebase Console**

   - Buka Firebase Console
   - Navigate ke Realtime Database
   - Lihat data di path `batteryData/`

3. **Check Frontend**
   - WebSocket akan otomatis push data baru
   - Event: `battery-data`

### 8️⃣ Export Data to CSV

```bash
# Via Browser
http://localhost:3000/api/battery/export-csv

# Via curl
curl -O http://localhost:3000/api/battery/export-csv
```

---

## 📊 Expected Console Output

Saat server running dengan baik:

```
═══════════════════════════════════════════════
🚀 BMS Server running in development mode
📡 HTTP Server: http://localhost:3000
🔌 WebSocket Server: ws://localhost:3000
═══════════════════════════════════════════════

🔌 Connecting to MQTT broker: b2768521dac84b908c1d7eb68bf58c97.s1.eu.hivemq.cloud:8883...
✅ Connected to MQTT broker successfully!
✅ Successfully subscribed to topic: baterai/perintah
✅ WebSocket service initialized

📥 Processing data from topic: baterai/perintah
✅ Data berhasil disimpan ke Firebase: -NxYZ123ABC
📡 Broadcasting data to 1 clients
✅ Data processing completed
```

---

## 🧪 Testing Endpoints

### 1. Get Latest Data

```bash
curl http://localhost:3000/api/battery/latest?limit=5
```

### 2. Get Last Month Data

```bash
curl http://localhost:3000/api/battery/last-month
```

### 3. Get Data by Range

```bash
curl "http://localhost:3000/api/battery/range?startDate=2025-10-01&endDate=2025-10-14"
```

### 4. Export CSV

```bash
curl -O http://localhost:3000/api/battery/export-csv
```

### 5. System Status

```bash
curl http://localhost:3000/api/battery/status
```

---

## 🔧 Troubleshooting

### Problem: MQTT tidak connect

**Solution:**

1. Check internet connection
2. Verify credentials di `config/environments/mqtt-enviroment.json`
3. Check firewall settings (port 8883)

### Problem: Firebase error

**Solution:**

1. Verify `FIREBASE_DATABASE_URL` di `.env`
2. Check Firebase Admin SDK JSON file exists
3. Verify Firebase project settings

### Problem: WebSocket tidak connect dari frontend

**Solution:**

1. Check `FRONTEND_URL` di `.env`
2. Verify CORS settings
3. Use correct WebSocket URL: `http://localhost:3000`

### Problem: No data received

**Solution:**

1. Check MQTT publisher sending data
2. Verify topic name: `baterai/perintah`
3. Check server console logs

---

## 📁 Project Structure Summary

```
BE_BMS/
├── src/
│   ├── app.js                  # ⭐ Main application
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API endpoints
│   ├── services/               # MQTT, Firebase, WebSocket
│   └── middleware/             # Error handler, logger
├── config/
│   ├── database/firebase.js    # Firebase initialization
│   └── environments/           # MQTT config
├── scripts/
│   └── mqtt-test-publisher.js  # 🧪 Test data generator
├── docs/
│   ├── API.md                  # 📚 API documentation
│   └── TESTING.md              # Testing guide
└── .env                        # ⚙️ Environment variables
```

---

## 🎯 Next Steps

1. ✅ Server running
2. ✅ MQTT connected
3. ✅ Data flowing to Firebase
4. ✅ WebSocket broadcasting
5. 📱 Connect your frontend
6. 🎨 Customize data fields sesuai kebutuhan
7. 🔐 Add authentication (optional)
8. 🚀 Deploy to production

---

## 📞 Need Help?

- Check `docs/API.md` untuk API documentation lengkap
- Check `docs/TESTING.md` untuk testing guide
- Check console logs untuk error messages

---

**Happy Coding! 🚀**
