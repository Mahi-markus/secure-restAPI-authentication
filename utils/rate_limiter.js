const rateLimit = require("express-rate-limit");

const auth_limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 20 requests per IP
  message: { error: "Too many login attempts, please try again later" },
});

const payment_limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per IP
  message: { error: "Too many payment requests, please try again later" },
});

module.exports = { auth_limiter, payment_limiter };
