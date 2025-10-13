# Changelog - Battery Monitoring System

## [1.1.0] - 2025-10-14

### 🔄 Changed - Updated Data Format

#### New MQTT Data Format

Aplikasi sekarang menerima format data yang lebih sederhana dari IoT device:

**Before:**

```json
{
  "voltage": 12.5,
  "current": 2.3,
  "temperature": 25.5,
  "soc": 85,
  "status": "charging"
}
```

**After (Current):**

```json
{
  "voltage": 48.5,
  "percentage": 75
}
```

### 📝 Updated Files

#### 1. **Controller** - `src/controllers/batteryController.js`

- ✅ Updated CSV export fields
- ✅ Changed from: `voltage, current, temperature, soc, status`
- ✅ Changed to: `voltage, percentage`

#### 2. **Documentation** - `README.md`

- ✅ Updated expected MQTT data format section
- ✅ Added field descriptions
- ✅ Removed old field references

#### 3. **API Documentation** - `docs/API.md`

- ✅ Updated Battery Data Object model
- ✅ Updated all API response examples
- ✅ Updated CSV export format example
- ✅ Updated WebSocket event examples
- ✅ Updated frontend integration examples

#### 4. **Testing Guide** - `docs/TESTING.md`

- ✅ Updated sample payloads
- ✅ Updated Node.js test script
- ✅ Updated Python test script
- ✅ Removed old field references

#### 5. **Test Publisher** - `scripts/mqtt-test-publisher.js`

- ✅ Updated to generate data with new format
- ✅ Voltage range: 44-52V (typical 48V battery system)
- ✅ Percentage range: 0-100%

### 🎯 Data Structure

#### Received from MQTT (IoT Device)

```json
{
  "voltage": 48.5, // Battery voltage in Volt
  "percentage": 75 // Battery percentage (0-100)
}
```

#### Stored in Firebase

```json
{
  "voltage": 48.5,
  "percentage": 75,
  "timestamp": 1697289600000,
  "dateTime": "2025-10-14T10:30:00.000Z"
}
```

#### Sent to Frontend (WebSocket)

```json
{
  "voltage": 48.5,
  "percentage": 75,
  "timestamp": 1697289600000,
  "dateTime": "2025-10-14T10:30:00.000Z",
  "serverTimestamp": 1697289600500
}
```

#### CSV Export Format

```csv
ID,Timestamp,Date Time,Voltage (V),Percentage (%)
-NxYZ123,1697289600000,2025-10-14T10:30:00.000Z,48.50,75
```

### ✅ Production Ready

- ✅ No dummy data generators in main branch
- ✅ No testing code in production
- ✅ All documentation updated
- ✅ CSV export working with new format
- ✅ WebSocket broadcasting correct data
- ✅ Firebase storing correct format

### 🚀 How to Use

#### Send Data to MQTT

```bash
# Using test script
node scripts/mqtt-test-publisher.js

# Or from IoT device
Topic: baterai/perintah
Payload: {"voltage": 48.50, "percentage": 75}
```

#### Frontend Integration

```javascript
socket.on("battery-data", (data) => {
  console.log("Voltage:", data.voltage + "V");
  console.log("Percentage:", data.percentage + "%");
});
```

#### Export CSV

```bash
curl -O http://localhost:3000/api/battery/export-csv
```

### 📌 Notes

- Backend is backward compatible - will accept any JSON and store it
- Only voltage and percentage are now expected/documented
- All old references to current, temperature, soc, status have been removed
- Test scripts updated to match production data format

---

## [1.0.0] - 2025-10-14

### 🎉 Initial Release

- ✅ MQTT integration for real-time data
- ✅ Firebase Realtime Database storage
- ✅ WebSocket for frontend communication
- ✅ REST API with CSV export
- ✅ Complete documentation
