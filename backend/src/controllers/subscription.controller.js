const User = require("../models/User");

exports.activatePremium = async (req, res) => {

  try {

    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionPlan: "PREMIUM",
        subscriptionStatus: "ACTIVE",
        subscriptionActivatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: "Premium activated",
      user
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// Existing activatePremium stays as-is...

exports.startFreeTrial = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.trialUsed) {
      return res.status(400).json({ message: "Free trial already used" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionPlan: "PREMIUM",
        subscriptionStatus: "TRIAL",
        trialStartedAt: new Date(),
        trialUsed: true,
      },
      { new: true }
    );

    res.json({ message: "Free trial activated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};