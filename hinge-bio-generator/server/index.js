require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bioRoutes = require("./routes/bioRoutes");

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://6vvx9t5w-3000.asse.devtunnels.ms'
  ],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token']
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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
