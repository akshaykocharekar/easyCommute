const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");

const {
  createOrder,
  verifyPayment,
  getRevenue
} = require("../controllers/payment.controller");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);

// ADMIN ONLY
router.get("/revenue", protect, getRevenue);

module.exports = router;