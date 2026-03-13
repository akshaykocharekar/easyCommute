const express = require("express");
const router = express.Router();
const {
  register, registerOperator, login,
  verifyEmailOTP, resendOTP,
  verifyLoginOTP,
  forgotPassword, resetPassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/register-operator", registerOperator);
router.post("/login", login);
router.post("/verify-email", verifyEmailOTP);
router.post("/resend-otp", resendOTP);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/me", protect, (req, res) => res.json({ user: req.user }));

module.exports = router;