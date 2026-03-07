const express = require("express");
const router = express.Router();
const Bus = require("../models/Bus");
const busController = require("../controllers/bus.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

/* =========================
   Get All Buses
========================= */
router.get("/", protect, authorizeRoles("SUPER_ADMIN"), busController.getBuses);

router.get("/public", protect, async (req, res) => {
  const buses = await Bus.find({
    isApproved: true,
    status: "ACTIVE",
  }).populate("route");

  res.json(buses);
});

/* =========================
   Create Bus
========================= */
router.post(
  "/",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.createBus
);

/* =========================
   Assign Route
========================= */
router.post(
  "/assign-route",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.assignRouteToBus
);

/* =========================
   Approve Bus
========================= */
router.post(
  "/approve",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.approveBus
);

/* =========================
   Delist Bus
========================= */
router.post(
  "/delist",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.delistBus
);

/* =========================
   Assign Operator
========================= */
router.post(
  "/assign-operator",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.assignOperatorToBus
);

/* =========================
   Unassign Operator
========================= */
router.post(
  "/unassign-operator",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.unassignOperatorFromBus
);

/* =========================
   Unassign Route
========================= */
router.post(
  "/unassign-route",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  busController.unassignRouteFromBus
);

/* =========================
   Update Occupancy
========================= */
router.post(
  "/update-occupancy",
  protect,
  authorizeRoles("BUS_OPERATOR"),
  busController.updateOccupancy
);

/* =========================
   Get Assigned Bus for Operator
========================= */
router.get(
  "/my-bus",
  protect,
  authorizeRoles("BUS_OPERATOR"),
  busController.getMyBus
);

module.exports = router;
