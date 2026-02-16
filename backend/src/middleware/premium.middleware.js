exports.requirePremium = (req, res, next) => {
  if (
    req.user.subscriptionPlan === "PREMIUM" &&
    req.user.subscriptionStatus === "ACTIVE"
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Premium subscription required"
  });
};
