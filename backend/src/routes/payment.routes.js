const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const {
  createOrder,
  verifyPayment
} = require("../controllers/payment.controller");

/**
 * Create Razorpay order
 */
router.post("/create-order", protect, createOrder);

/**
 * Verify payment & activate premium
 */
router.post("/verify", protect, verifyPayment);

module.exports = router;
