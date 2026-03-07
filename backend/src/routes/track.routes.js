const express = require("express");
const router = express.Router();

const { getBusTrackingData } = require("../controllers/track.controller");
const { protect } = require("../middleware/auth.middleware");
const { requirePremium } = require("../middleware/premium.middleware");

router.get("/:busId", protect, requirePremium, getBusTrackingData);

module.exports = router;