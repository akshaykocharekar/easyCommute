const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
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

module.exports = app;
