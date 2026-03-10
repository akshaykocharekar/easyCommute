const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
  {
    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      default: null,
    },
    category: {
      type: String,
      enum: ["ROUTE_CHANGE", "BUS_DETAIL_CHANGE", "OTHER"],
      default: "OTHER",
      index: true,
    },
    subject: {
      type: String,
      trim: true,
      required: true,
      maxlength: 120,
    },
    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "OPEN",
      index: true,
    },
    adminNote: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupportRequest", supportRequestSchema);

