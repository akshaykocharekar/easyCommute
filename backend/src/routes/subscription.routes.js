const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { activatePremium } = require("../controllers/subscription.controller");

router.post("/activate", protect, activatePremium);

module.exports = router;