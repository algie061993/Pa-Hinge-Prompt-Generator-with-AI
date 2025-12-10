require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const bioRoutes = require("./routes/bioRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/hinge-bio-generator";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✓ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/bio", bioRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
