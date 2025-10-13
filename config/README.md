# Firebase Admin SDK Configuration

## ⚠️ Important: Add Your Firebase Service Account File

Untuk menggunakan Firebase Realtime Database, Anda perlu menambahkan file service account JSON dari Firebase.

### Langkah-langkah:

1. **Buka Firebase Console**

   - Go to: https://console.firebase.google.com/
   - Pilih project Anda: `bms-pmld`

2. **Generate Service Account Key**

   - Click ⚙️ (Settings) > Project Settings
   - Tab "Service Accounts"
   - Click "Generate New Private Key"
   - Download file JSON

3. **Rename dan Copy File**

   - Rename file menjadi: `bms-pmld-firebase-adminsdk-fbsvc-afd823dc16.json`
   - Copy file ke folder ini: `config/`

4. **⚠️ JANGAN COMMIT KE GIT**
   - File ini sudah ada di `.gitignore`
   - Jangan pernah commit file ini ke repository public

### Alternative: Using Environment Variables

Jika tidak ingin menggunakan file JSON, Anda bisa set environment variables:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-file.json"
```

Atau gunakan Firebase credentials dari Google Cloud:

```bash
gcloud auth application-default login
```

---

**Note:** Application akan tetap berjalan tanpa file ini, tapi Firebase operations akan error. Pastikan file sudah ada sebelum production.
