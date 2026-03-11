const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
      unique: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    // Previous position — used to derive real-time speed in ETA controller
    previousLatitude: {
      type: Number,
      default: null
    },
    previousLongitude: {
      type: Number,
      default: null
    },
    previousUpdatedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
