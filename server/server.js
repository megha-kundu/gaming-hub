require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questionRoutes");
const scoreRoutes = require("./routes/scoreRoutes");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");

// Disable Mongoose command buffering so queries NEVER wait 10 seconds
mongoose.set("bufferCommands", false);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

// MongoDB Connection Helper
const mongoURI = process.env.MONGO_URI;
if (mongoURI) {
  mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 })
      .then(() => {
          console.log("MongoDB Atlas Connected ✅");
      })
      .catch((err) => {
          console.log("MongoDB Connection Notice: Fast in-memory state active. ⚡", err.message);
      });
} else {
  console.log("⚠️ MONGO_URI not provided in .env - Fast in-memory state active.");
}

// Default Health Route
app.get("/", (req, res) => {
    res.send("Educational Gaming Backend API is Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});