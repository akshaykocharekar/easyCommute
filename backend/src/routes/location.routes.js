const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const { requirePremium } = require("../middleware/premium.middleware");

const {
  updateLocation,
  getLatestLocation,
} = require("../controllers/location.controller");

// Operator updates GPS
router.post(
  "/update",
  protect,
  authorizeRoles("BUS_OPERATOR"),
  updateLocation
);

// Users fetch live location (premium)
router.get(
  "/:busId",
  protect,
  requirePremium,
  getLatestLocation
);

module.exports = router;
