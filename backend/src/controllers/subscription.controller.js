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

