const express = require("express");
const router = express.Router();
const {
  createBus,
  assignRouteToBus,
  approveBus,
  delistBus,
  assignOperatorToBus,
  updateOccupancy,
} = require("../controllers/bus.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post("/", protect, authorizeRoles("SUPER_ADMIN"), createBus);

router.post(
  "/assign-route",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  assignRouteToBus
);

// ✅ ADD THESE
router.post("/approve", protect, authorizeRoles("SUPER_ADMIN"), approveBus);

router.post("/delist", protect, authorizeRoles("SUPER_ADMIN"), delistBus);

router.post(
  "/assign-operator",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  assignOperatorToBus
);

router.post(
  "/update-occupancy",
  protect,
  authorizeRoles("BUS_OPERATOR"),
  updateOccupancy
);

module.exports = router;
