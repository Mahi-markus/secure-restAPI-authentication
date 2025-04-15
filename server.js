require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();
const authRoutes = require("./routes/auth.routes");

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/auth", authRoutes);

// Connect DB and start server
mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, " MongoDB connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB successfully!");
});
