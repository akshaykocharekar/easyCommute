module.exports.requirePremium = (req, res, next) => {

  const user = req.user;

  if (
    user.subscriptionPlan !== "PREMIUM" ||
    user.subscriptionStatus !== "ACTIVE"
  ) {
    return res.status(403).json({
      message: "Premium subscription required"
    });
  }

  next();
};