const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {
  updateLocation,
  getLatestLocation,
} = require("../controllers/location.controller");

router.post("/update", protect, authorizeRoles("BUS_OPERATOR"), updateLocation);

router.get("/:busId", protect, getLatestLocation);

module.exports = router;
