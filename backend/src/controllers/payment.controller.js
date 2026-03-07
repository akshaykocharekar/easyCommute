const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {

    const options = {
      amount: 50000, // ₹500
      currency: "INR",
      receipt: "premium_subscription",
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionPlan: "PREMIUM",
        subscriptionStatus: "ACTIVE",
        razorpayPaymentId: razorpay_payment_id,
        subscriptionActivatedAt: new Date(),
      },
      { new: true }
    ).select("-password");

    res.json({
      message: "Payment successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {

    // Only admin allowed
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    const users = await User.find({
      subscriptionStatus: "ACTIVE"
    });

    const totalSubscribers = users.length;
    const totalRevenue = totalSubscribers * 500;

    res.json({
      totalSubscribers,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};