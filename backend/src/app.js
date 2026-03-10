const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://easy-commute-one.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/routes", require("./routes/route.routes"));
app.use("/api/buses", require("./routes/bus.routes"));
app.use("/api/location", require("./routes/location.routes"));
app.use("/api/eta", require("./routes/eta.routes"));
app.use("/api/occupancy", require("./routes/occupancy.routes"));
app.use("/api/payment", require("./routes/payment.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/track", require("./routes/track.routes"));
app.use("/api/nearby", require("./routes/nearby.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/subscription", require("./routes/subscription.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/support", require("./routes/support.routes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;