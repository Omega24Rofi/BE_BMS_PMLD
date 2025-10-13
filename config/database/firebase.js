const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// Path to service account file
const serviceAccountPath = path.join(
  __dirname,
  "../environments/bms-pmld-firebase-adminsdk-fbsvc-afd823dc16.json"
);

// Check if service account file exists
if (!fs.existsSync(serviceAccountPath)) {
  console.warn("⚠️  Firebase Admin SDK file not found!");
  console.warn("⚠️  Please add your Firebase service account JSON file to:");
  console.warn(`⚠️  ${serviceAccountPath}`);
  console.warn("⚠️  Continuing with environment variables (if available)...\n");
}

// Initialize Firebase Admin SDK
let credential;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Try using environment variables
    credential = admin.credential.applicationDefault();
  }
} catch (error) {
  console.error("❌ Error loading Firebase credentials:", error.message);
  console.log("💡 Using default credentials...");
  credential = admin.credential.applicationDefault();
}

admin.initializeApp({
  credential: credential,
  databaseURL:
    process.env.FIREBASE_DATABASE_URL ||
    "https://bms-pmld-default-rtdb.firebaseio.com",
});

const db = admin.database();

console.log("✅ Firebase Admin SDK initialized");

module.exports = { admin, db };
