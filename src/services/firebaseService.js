const { db } = require("../../config/database/firebase");

class FirebaseService {
  constructor() {
    this.batteryDataRef = db.ref("batteryData");
  }

  /**
   * Menyimpan data battery ke Firebase Realtime Database
   * @param {Object} data - Data battery dari MQTT
   * @returns {Promise<Object>} - Reference ke data yang disimpan
   */
  async saveBatteryData(data) {
    try {
      const timestamp = Date.now();
      const dataWithTimestamp = {
        ...data,
        timestamp,
        dateTime: new Date(timestamp).toISOString(),
      };

      // Simpan data dengan push() untuk membuat unique key
      const newDataRef = await this.batteryDataRef.push(dataWithTimestamp);

      console.log("✅ Data berhasil disimpan ke Firebase:", newDataRef.key);
      return { success: true, key: newDataRef.key, data: dataWithTimestamp };
    } catch (error) {
      console.error("❌ Error menyimpan data ke Firebase:", error);
      throw error;
    }
  }

  /**
   * Mengambil data battery dari 1 bulan terakhir
   * @returns {Promise<Array>} - Array data battery
   */
  async getBatteryDataLastMonth() {
    try {
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000; // 30 hari

      const snapshot = await this.batteryDataRef
        .orderByChild("timestamp")
        .startAt(oneMonthAgo)
        .once("value");

      const data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      console.log(`📊 Mengambil ${data.length} data dari 1 bulan terakhir`);
      return data;
    } catch (error) {
      console.error("❌ Error mengambil data dari Firebase:", error);
      throw error;
    }
  }

  /**
   * Mengambil data battery berdasarkan range tanggal
   * @param {number} startDate - Timestamp awal
   * @param {number} endDate - Timestamp akhir
   * @returns {Promise<Array>} - Array data battery
   */
  async getBatteryDataByDateRange(startDate, endDate) {
    try {
      const snapshot = await this.batteryDataRef
        .orderByChild("timestamp")
        .startAt(startDate)
        .endAt(endDate)
        .once("value");

      const data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      console.log(
        `📊 Mengambil ${data.length} data dari ${new Date(
          startDate
        ).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
      );
      return data;
    } catch (error) {
      console.error("❌ Error mengambil data dari Firebase:", error);
      throw error;
    }
  }

  /**
   * Mengambil data battery terbaru
   * @param {number} limit - Jumlah data yang diambil
   * @returns {Promise<Array>} - Array data battery
   */
  async getLatestBatteryData(limit = 10) {
    try {
      const snapshot = await this.batteryDataRef
        .orderByChild("timestamp")
        .limitToLast(limit)
        .once("value");

      const data = [];
      snapshot.forEach((childSnapshot) => {
        data.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });

      return data.reverse(); // Reverse untuk mendapat yang terbaru dulu
    } catch (error) {
      console.error("❌ Error mengambil data terbaru dari Firebase:", error);
      throw error;
    }
  }

  /**
   * Menghapus data lama (older than specified days)
   * @param {number} days - Jumlah hari untuk keep data
   * @returns {Promise<number>} - Jumlah data yang dihapus
   */
  async cleanupOldData(days = 90) {
    try {
      const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

      const snapshot = await this.batteryDataRef
        .orderByChild("timestamp")
        .endAt(cutoffDate)
        .once("value");

      let count = 0;
      const updates = {};

      snapshot.forEach((childSnapshot) => {
        updates[childSnapshot.key] = null; // Set to null untuk delete
        count++;
      });

      if (count > 0) {
        await this.batteryDataRef.update(updates);
        console.log(
          `🗑️ Berhasil menghapus ${count} data lama (lebih dari ${days} hari)`
        );
      }

      return count;
    } catch (error) {
      console.error("❌ Error menghapus data lama:", error);
      throw error;
    }
  }
}

module.exports = new FirebaseService();
