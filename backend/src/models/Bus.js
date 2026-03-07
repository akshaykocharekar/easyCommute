const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "INACTIVE",
    },
    currentOccupancy: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

// One operator can drive at most one bus (sparse => multiple nulls allowed)
busSchema.index({ operator: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Bus", busSchema);
