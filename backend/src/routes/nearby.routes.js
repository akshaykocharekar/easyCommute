const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { getNearbyBuses } = require("../controllers/nearby.controller");

router.get("/", protect, getNearbyBuses);

module.exports = router;