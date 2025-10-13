const morgan = require("morgan");

// Custom morgan token for response time with color
morgan.token("colored-status", (req, res) => {
  const status = res.statusCode;
  const color =
    status >= 500
      ? 31 // red
      : status >= 400
      ? 33 // yellow
      : status >= 300
      ? 36 // cyan
      : status >= 200
      ? 32 // green
      : 0; // no color
  return `\x1b[${color}m${status}\x1b[0m`;
});

// Custom format
const logFormat =
  ":method :url :colored-status :response-time ms - :res[content-length]";

module.exports = morgan(logFormat);
