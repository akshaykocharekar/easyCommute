const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getETA } = require("../controllers/eta.controller");
const { requirePremium } = require("../middleware/premium.middleware");


router.get("/", protect, getETA);


router.get("/", protect, requirePremium, getETA);

module.exports = router;
