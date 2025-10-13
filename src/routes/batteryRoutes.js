const express = require("express");
const router = express.Router();
const batteryController = require("../controllers/batteryController");

/**
 * @route   GET /api/battery/last-month
 * @desc    Get battery data dari 1 bulan terakhir (JSON)
 * @access  Public
 */
router.get("/last-month", batteryController.getLastMonthData);

/**
 * @route   GET /api/battery/export-csv
 * @desc    Export battery data 1 bulan terakhir ke CSV
 * @access  Public
 */
router.get("/export-csv", batteryController.exportToCSV);

/**
 * @route   GET /api/battery/range
 * @desc    Get battery data berdasarkan date range
 * @query   startDate, endDate (ISO date format)
 * @access  Public
 */
router.get("/range", batteryController.getDataByDateRange);

/**
 * @route   GET /api/battery/latest
 * @desc    Get latest battery data
 * @query   limit (optional, default: 10)
 * @access  Public
 */
router.get("/latest", batteryController.getLatestData);

/**
 * @route   GET /api/battery/status
 * @desc    Get system status
 * @access  Public
 */
router.get("/status", batteryController.getSystemStatus);

module.exports = router;
