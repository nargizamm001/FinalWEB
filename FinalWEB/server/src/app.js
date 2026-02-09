const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

const workoutRoutes = require("./routes/workoutRoutes");
const metricRoutes = require("./routes/metricRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const { notFound, errorHandler } = require("./middleware/error");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, name: "Fitness Tracker API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/workouts", workoutRoutes);
app.use("/api/metrics", metricRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;