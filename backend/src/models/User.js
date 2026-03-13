const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "BUS_OPERATOR", "USER"],
      default: "USER",
    },

    operatorVerificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    operatorVerifiedAt: {
      type: Date,
    },

    operatorRejectedAt: {
      type: Date,
    },

    operatorRejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    subscriptionPlan: {
      type: String,
      enum: ["FREE", "PREMIUM"],
      default: "FREE",
    },

 subscriptionStatus: {
  type: String,
  enum: ["ACTIVE", "INACTIVE", "TRIAL"],  // add TRIAL
  default: "INACTIVE",
},
emailVerified: {
  type: Boolean,
  default: false,
},

otp: {
  type: String,
},

otpExpiresAt: {
  type: Date,
},
// Add these two new fields:
trialStartedAt: {
  type: Date,
},

trialUsed: {
  type: Boolean,
  default: false,
},
    razorpayPaymentId: {
      type: String,
    },

    subscriptionActivatedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
