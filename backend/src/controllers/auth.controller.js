const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

// Helper — generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp, subject, message) => {
  await transporter.sendMail({
    from: `"EasyCommute" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#10b981">EasyCommute</h2>
        <p>${message}</p>
        <div style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0f172a;margin:24px 0">${otp}</div>
        <p style="color:#64748b;font-size:12px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
      emailVerified: false,
    });

    await sendOTPEmail(email, otp, "Verify your EasyCommute account", "Use the OTP below to verify your email:");

    res.status(201).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY EMAIL OTP
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiresAt) return res.status(400).json({ message: "OTP expired" });

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESEND OTP
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) return res.status(400).json({ message: "Email already verified" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(user.email, otp, "Your new EasyCommute OTP", "Here is your new OTP:");
    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OPERATOR REGISTER
exports.registerOperator = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    const operator = await User.create({
      name,
      email,
      phone: String(phone || "").trim(),
      password: hashedPassword,
      role: "BUS_OPERATOR",
      operatorVerificationStatus: "PENDING",
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      emailVerified: false,
    });

    await sendOTPEmail(email, otp, "Verify your EasyCommute Operator account", "Use the OTP below to verify your email:");

    res.status(201).json({
      message: "OTP sent to your email. Please verify to complete registration.",
      userId: operator._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.emailVerified) return res.status(403).json({ message: "Please verify your email before logging in.", userId: user._id });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Operator gets OTP on every login
    if (user.role === "BUS_OPERATOR") {
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      await sendOTPEmail(email, otp, "Your EasyCommute login OTP", "Use this OTP to complete your login:");
      return res.json({ message: "OTP sent to your email.", userId: user._id, requiresOTP: true });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        operatorVerificationStatus: user.operatorVerificationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OPERATOR LOGIN OTP
exports.verifyLoginOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiresAt) return res.status(400).json({ message: "OTP expired" });

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: user.role,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        operatorVerificationStatus: user.operatorVerificationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD - send OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, otp, "Reset your EasyCommute password", "Use this OTP to reset your password:");
    res.json({ message: "OTP sent to your email.", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (new Date() > user.otpExpiresAt) return res.status(400).json({ message: "OTP expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({ message: "Password reset successfully. You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};