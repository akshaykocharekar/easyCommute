const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getOccupancyStatus } = require("../controllers/occupancy.controller");
const { requirePremium } = require("../middleware/premium.middleware");
router.get("/:busId", protect, getOccupancyStatus);
router.get("/:busId", protect, requirePremium, getOccupancyStatus);

module.exports = router;
