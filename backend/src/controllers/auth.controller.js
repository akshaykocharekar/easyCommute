const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

const userPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  subscriptionPlan: user.subscriptionPlan,
  subscriptionStatus: user.subscriptionStatus,
  operatorVerificationStatus: user.operatorVerificationStatus,
});

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hashedPassword,
      role: "USER", emailVerified: true,
    });

    const token = signToken(user);
    res.status(201).json({ message: "Registration successful.", token, user: userPayload(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OPERATOR REGISTER
exports.registerOperator = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const operator = await User.create({
      name, email,
      phone: String(phone || "").trim(),
      password: hashedPassword,
      role: "BUS_OPERATOR",
      operatorVerificationStatus: "PENDING",
      emailVerified: true,
    });

    const token = signToken(operator);
    res.status(201).json({
      message: "Operator registration successful. Await admin approval.",
      token, user: userPayload(operator),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = signToken(user);
    res.json({ token, user: userPayload(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stubs — kept so no existing calls break
exports.verifyEmailOTP = (_req, res) => res.json({ message: "Not required." });
exports.resendOTP      = (_req, res) => res.json({ message: "Not required." });
exports.verifyLoginOTP = (_req, res) => res.json({ message: "Not required." });