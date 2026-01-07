const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/routes", require("./routes/route.routes"));
app.use("/api/buses", require("./routes/bus.routes"));

module.exports = app;
