# BE_BMS - Battery Monitoring System Backend# BE_BMS - Backend Management System

## 📋 Project Overview## Project Overview

Backend API untuk Battery Monitoring System (BMS) yang mengintegrasikan:

- 📡 **MQTT** - Menerima data real-time dari IoT deviceThis is the backend API for the PMLD (Project Management and Logistics Dashboard) BMS (Building Management System).

- 🔥 **Firebase Realtime Database** - Menyimpan data battery

- 🌐 **WebSocket (Socket.IO)** - Mengirim data real-time ke frontend## Project Structure

- 📊 **REST API** - Export data dalam format CSV

```

## ✨ FeaturesBE_BMS/

├── src/                    # Source code

### 1. Real-time Data Collection│   ├── controllers/        # Route controllers

- ✅ Menerima data dari MQTT broker secara real-time│   ├── models/            # Data models

- ✅ Auto-reconnect jika koneksi terputus│   ├── routes/            # API routes

- ✅ Support untuk secure connection (mqtts)│   ├── middleware/        # Custom middleware

│   ├── services/          # Business logic

### 2. Data Storage│   ├── utils/             # Utility functions

- ✅ Menyimpan semua data ke Firebase Realtime Database│   └── app.js             # Main application file

- ✅ Timestamp otomatis untuk setiap data├── config/                # Configuration files

- ✅ Cleanup data lama (optional)│   ├── environments/      # Environment-specific configs

│   ├── database/          # Database configurations

### 3. Real-time Broadcasting│   └── bms-pmld-firebase-adminsdk-fbsvc-afd823dc16.json

- ✅ WebSocket untuk push data ke frontend secara real-time├── tests/                 # Test files

- ✅ Multiple client support│   ├── unit/              # Unit tests

- ✅ Connection status monitoring│   ├── integration/       # Integration tests

│   └── fixtures/          # Test data

### 4. Data Export├── logs/                  # Application logs

- ✅ Export data 1 bulan terakhir ke CSV├── docs/                  # Documentation

- ✅ Filter berdasarkan date range├── scripts/               # Build and deployment scripts

- ✅ REST API untuk akses data├── uploads/               # File uploads

├── .env.example           # Environment variables template

## 🏗️ Project Structure├── .gitignore            # Git ignore rules

└── package.json          # Dependencies and scripts

```

BE_BMS/

├── src/## Getting Started

│ ├── controllers/

│ │ └── batteryController.js # Request handlers### Prerequisites

│ ├── middleware/

│ │ ├── errorHandler.js # Global error handler- Node.js (v16 or higher)

│ │ └── logger.js # HTTP request logger- npm or yarn

│ ├── routes/- Firebase account (for authentication)

│ │ ├── index.js # Main router

│ │ └── batteryRoutes.js # Battery endpoints### Installation

│ ├── services/

│ │ ├── mqttService.js # MQTT client & handlers1. Clone the repository

│ │ ├── firebaseService.js # Firebase operations2. Install dependencies:

│ │ └── websocketService.js # Socket.IO server

│ └── app.js # Main application ```bash

├── config/ npm install

│ ├── database/ ```

│ │ └── firebase.js # Firebase initialization

│ └── environments/3. Create environment file:

│ └── mqtt-enviroment.json # MQTT configuration

├── logs/ # Application logs ```bash

├── docs/ # Documentation cp .env.example .env

├── tests/ # Test files ```

└── .env # Environment variables

```4. Update the `.env` file with your configuration values

## 🚀 Getting Started5. Start the development server:

````bash

### Prerequisites   npm run dev

- **Node.js** v16 or higher   ```

- **npm** or yarn

- **Firebase** account with Realtime Database### Available Scripts

- **MQTT Broker** (HiveMQ Cloud atau broker lainnya)

- `npm start` - Start the production server

### Installation- `npm run dev` - Start the development server with nodemon

- `npm test` - Run tests

1. **Clone repository**

```bash## API Documentation

git clone <repository-url>

cd BE_BMSAPI documentation will be available at `/docs` when the server is running.

````

## Technologies Used

2. **Install dependencies**

   ````bash- **Node.js** - Runtime environment

   npm install- **Express.js** - Web framework

   ```- **Firebase Admin** - Authentication and database
   ````

- **dotenv** - Environment variable management

3. **Setup environment variables**

   ````bash## Contributing

   cp .env.example .env

   ```1. Create a feature branch

   2. Make your changes

   Edit `.env` file:3. Write tests

   ```env4. Submit a pull request

   PORT=3000

   NODE_ENV=development## License

   FRONTEND_URL=http://localhost:5173

   FIREBASE_DATABASE_URL=https://your-project.firebaseio.comThis project is licensed under the ISC License.

   ````

4. **Configure MQTT**

   Edit `config/environments/mqtt-enviroment.json`:

   ```json
   {
     "mqtt_server": "your-mqtt-broker.com",
     "mqtt_user": "your_username",
     "mqtt_pass": "your_password",
     "mqtt_port": 8883,
     "pub_topic": "baterai/status",
     "sub_topic": "baterai/perintah"
   }
   ```

5. **Add Firebase Admin SDK**

   Place your Firebase service account JSON file in:

   ```
   config/bms-pmld-firebase-adminsdk-fbsvc-afd823dc16.json
   ```

6. **Start the server**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Health Check

```http
GET /api/health
```

### Get Latest Data

```http
GET /api/battery/latest?limit=10
```

### Get Last Month Data

```http
GET /api/battery/last-month
```

### Get Data by Date Range

```http
GET /api/battery/range?startDate=2025-01-01&endDate=2025-01-31
```

### Export to CSV

```http
GET /api/battery/export-csv
```

Downloads CSV file dengan data 1 bulan terakhir.

### System Status

```http
GET /api/battery/status
```

Response:

```json
{
  "success": true,
  "status": {
    "mqtt": {
      "connected": true,
      "config": {
        "server": "broker.hivemq.com",
        "port": 8883
      }
    },
    "websocket": {
      "connectedClients": 3
    },
    "server": {
      "uptime": 12345,
      "memory": {...}
    }
  }
}
```

## 🔌 WebSocket Events

### Client → Server

**Connect to WebSocket**

```javascript
const socket = io("http://localhost:3000");
```

**Request Latest Data**

```javascript
socket.emit("request-latest-data");
```

### Server → Client

**Connection Established**

```javascript
socket.on("connected", (data) => {
  console.log(data);
  // { message: 'Connected to BMS WebSocket Server', clientId: '...', timestamp: ... }
});
```

**Receive Battery Data**

```javascript
socket.on("battery-data", (data) => {
  console.log("New battery data:", data);
  // { voltage, current, temperature, soc, status, timestamp, ... }
});
```

**System Notifications**

```javascript
socket.on("notification", (notification) => {
  console.log(notification);
  // { message: '...', type: 'info|warning|error', timestamp: ... }
});
```

**Connection Status**

```javascript
socket.on("connection-status", (status) => {
  console.log(status);
  // { service: 'mqtt|firebase', status: true|false, timestamp: ... }
});
```

## 🔄 Data Flow

```
IoT Device (Battery)
       ↓
   MQTT Broker
       ↓
  MQTT Service (Subscribe)
       ↓
    ┌──────────────┐
    │   Data       │
    │ Processing   │
    └──────────────┘
       ↓         ↓
Firebase DB   WebSocket
 (Storage)    (Broadcast)
                 ↓
           Frontend Clients
```

## 📊 Expected MQTT Data Format

Data yang dikirim dari IoT device melalui MQTT broker harus dalam format JSON berikut:

```json
{
  "voltage": 48.5,
  "percentage": 75
}
```

**Field Description:**

- `voltage` (Number): Tegangan battery dalam Volt (V)
- `percentage` (Number): Persentase kapasitas battery (0-100%)

**Example Data:**

```json
{
  "voltage": 48.5,
  "percentage": 75
}
```

## 🛠️ Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm test        # Run tests
```

## 🔐 Security Notes

1. **MQTT Credentials**: Jangan commit file konfigurasi MQTT ke repository
2. **Firebase Admin SDK**: Simpan file JSON di luar repository atau gunakan environment variables
3. **CORS**: Set `FRONTEND_URL` di `.env` untuk production
4. **SSL/TLS**: Gunakan HTTPS dan WSS untuk production

## 📝 Environment Variables

| Variable                | Description              | Default               |
| ----------------------- | ------------------------ | --------------------- |
| `PORT`                  | Server port              | 3000                  |
| `NODE_ENV`              | Environment mode         | development           |
| `FRONTEND_URL`          | Frontend URL for CORS    | http://localhost:5173 |
| `FIREBASE_DATABASE_URL` | Firebase Realtime DB URL | -                     |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- battery.test.js
```

## 📚 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MQTT.js** - MQTT client
- **Firebase Admin SDK** - Database operations
- **json2csv** - CSV export
- **Morgan** - HTTP request logger
- **CORS** - Cross-origin resource sharing

## 🐛 Troubleshooting

### MQTT Connection Issues

```bash
# Check MQTT credentials in config/environments/mqtt-enviroment.json
# Verify broker URL and port
# Ensure firewall allows outbound connections on port 8883
```

### Firebase Connection Issues

```bash
# Verify FIREBASE_DATABASE_URL in .env
# Check Firebase Admin SDK JSON file path
# Ensure Firebase Realtime Database is enabled
```

### WebSocket Connection Issues

```bash
# Check CORS settings if connecting from different origin
# Verify frontend is using correct WebSocket URL
# Check firewall/proxy settings
```

## 📄 License

ISC License

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for Battery Monitoring System**
