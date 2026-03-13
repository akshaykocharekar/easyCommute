const User = require("../models/User");

module.exports.requirePremium = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Check trial
    if (user.subscriptionStatus === "TRIAL") {
      const hoursSinceTrial = (Date.now() - new Date(user.trialStartedAt)) / (1000 * 60 * 60);

      if (hoursSinceTrial > 168) {
        await User.findByIdAndUpdate(user._id, {
          subscriptionPlan: "FREE",
          subscriptionStatus: "INACTIVE",
        });
        return res.status(403).json({ message: "Your free trial has expired. Please upgrade to Premium." });
      }

      return next(); // Trial still valid
    }

    // Check paid premium
    if (user.subscriptionPlan !== "PREMIUM" || user.subscriptionStatus !== "ACTIVE") {
      return res.status(403).json({ message: "Premium subscription required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};