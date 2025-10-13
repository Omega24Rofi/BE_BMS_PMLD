const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    timestamp: Date.now(),
  });
};

module.exports = errorHandler;
