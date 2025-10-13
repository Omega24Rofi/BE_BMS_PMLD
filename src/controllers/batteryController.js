const firebaseService = require("../services/firebaseService");
const { Parser } = require("json2csv");

class BatteryController {
  /**
   * Get battery data dari 1 bulan terakhir
   */
  async getLastMonthData(req, res) {
    try {
      const data = await firebaseService.getBatteryDataLastMonth();

      res.status(200).json({
        success: true,
        count: data.length,
        data: data,
        period: "30 days",
      });
    } catch (error) {
      console.error("Error getting last month data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve data",
        error: error.message,
      });
    }
  }

  /**
   * Export battery data ke CSV format (1 bulan terakhir)
   */
  async exportToCSV(req, res) {
    try {
      const data = await firebaseService.getBatteryDataLastMonth();

      if (data.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No data available for the last month",
        });
      }

      // Define CSV fields
      const fields = [
        { label: "ID", value: "id" },
        { label: "Timestamp", value: "timestamp" },
        { label: "Date Time", value: "dateTime" },
        // Add your battery data fields here
        { label: "Voltage", value: "voltage" },
        { label: "Current", value: "current" },
        { label: "Temperature", value: "temperature" },
        { label: "SOC", value: "soc" },
        { label: "Status", value: "status" },
      ];

      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(data);

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=battery-data-${Date.now()}.csv`
      );

      res.status(200).send(csv);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      res.status(500).json({
        success: false,
        message: "Failed to export data to CSV",
        error: error.message,
      });
    }
  }

  /**
   * Get battery data berdasarkan date range
   */
  async getDataByDateRange(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "startDate and endDate query parameters are required",
        });
      }

      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();

      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format",
        });
      }

      const data = await firebaseService.getBatteryDataByDateRange(start, end);

      res.status(200).json({
        success: true,
        count: data.length,
        data: data,
        period: {
          start: new Date(start).toISOString(),
          end: new Date(end).toISOString(),
        },
      });
    } catch (error) {
      console.error("Error getting data by date range:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve data",
        error: error.message,
      });
    }
  }

  /**
   * Get latest battery data
   */
  async getLatestData(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const data = await firebaseService.getLatestBatteryData(limit);

      res.status(200).json({
        success: true,
        count: data.length,
        data: data,
      });
    } catch (error) {
      console.error("Error getting latest data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve latest data",
        error: error.message,
      });
    }
  }

  /**
   * Get system status
   */
  getSystemStatus(req, res) {
    const mqttService = require("../services/mqttService");
    const websocketService = require("../services/websocketService");

    res.status(200).json({
      success: true,
      status: {
        mqtt: {
          connected: mqttService.getConnectionStatus(),
          config: {
            server: mqttService.getConfig().mqtt_server,
            port: mqttService.getConfig().mqtt_port,
            topic: mqttService.getConfig().sub_topic,
          },
        },
        websocket: {
          connectedClients: websocketService.getConnectedClientsCount(),
        },
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: Date.now(),
        },
      },
    });
  }
}

module.exports = new BatteryController();
