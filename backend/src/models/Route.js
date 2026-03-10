const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
    },
    startPoint: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
    scheduleStartTime: {
      type: String,
      trim: true,
      default: "",
    },
    estimatedDurationMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    bidirectional: {
      type: Boolean,
      default: true,
    },
    stops: [
      {
        name: String,
        latitude: Number,
        longitude: Number,
      },
    ], // 🔥 NEW
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);
