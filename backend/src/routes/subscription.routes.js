const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { activatePremium, startFreeTrial } = require("../controllers/subscription.controller");

router.post("/activate", protect, activatePremium);
router.post("/trial", protect, startFreeTrial);

module.exports = router;