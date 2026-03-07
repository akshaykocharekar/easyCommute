const express = require("express");
const router = express.Router();

const { getETA } = require("../controllers/eta.controller");
const { protect } = require("../middleware/auth.middleware");
const { requirePremium } = require("../middleware/premium.middleware");

router.get("/:busId", protect, requirePremium, getETA);

module.exports = router;