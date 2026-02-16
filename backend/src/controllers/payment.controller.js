const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const User = require("../models/User");

/**
 * Create Razorpay Order
 */
exports.createOrder = async (req, res) => {
  try {
    if (req.user.role !== "USER") {
      return res.status(403).json({
        message: "Only commuters can purchase subscription"
      });
    }

    const options = {
      amount: 19900, // ₹199
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Verify Payment and Activate Premium
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed"
      });
    }

    const user = await User.findById(req.user._id);

    user.subscriptionPlan = "PREMIUM";
    user.subscriptionStatus = "ACTIVE";
    user.razorpayPaymentId = razorpay_payment_id;
    user.subscriptionActivatedAt = new Date();

    await user.save();

    res.json({
      message: "Premium activated successfully",
      subscriptionStatus: user.subscriptionStatus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
