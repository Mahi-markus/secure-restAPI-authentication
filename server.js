const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
require("./config/passport")(passport); // JWT strategy setup
const paymentRoutes = require("./routes/payment.routes");
const { auth_limiter, payment_limiter } = require("./utils/rate_limiter");
const errorHandler = require("./middlewares/error.middleware");

const app = express();
const authRoutes = require("./routes/auth.routes");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(passport.initialize());
app.use("/auth", auth_limiter, authRoutes);
app.use("/payments", payment_limiter, paymentRoutes);

// Handle unknown routes (404)
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.statusCode = 404;
  next(error);
});

// all routes above this
app.use(errorHandler); // Global Error handling middleware

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, " MongoDB connection error:"));
db.once("open", () => {
  console.log(" Connected to MongoDB successfully!");
});
