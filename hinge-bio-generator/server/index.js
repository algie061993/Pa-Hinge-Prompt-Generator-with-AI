require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bioRoutes = require("./routes/bioRoutes");

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = ["http://localhost:3000", "http://localhost:5000"];
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // In development, allow any local origin for convenience
      if (process.env.NODE_ENV !== "production") return callback(null, true);
      // Allow configured exact origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // Allow devtunnels and common local hostnames (127.0.0.1)
      try {
        const u = new URL(origin);
        const host = u.hostname;
        if (host === "localhost" || host === "127.0.0.1")
          return callback(null, true);
        if (host.endsWith(".devtunnels.ms")) return callback(null, true);
      } catch (e) {
        // ignore parse errors
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
  }),
);
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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Server running on port ${PORT}`);
});
