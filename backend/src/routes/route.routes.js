const express = require("express");
const router = express.Router();
const {
  createRoute,
  getAllRoutes,
  addStopToRoute,
  addStopsBatch,
  getRouteById,
} = require("../controllers/route.controller");

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post("/", protect, authorizeRoles("SUPER_ADMIN"), createRoute);

router.get("/", protect, getAllRoutes);

router.get("/:id", protect, getRouteById);   // ⭐ ADD THIS

router.post(
  "/add-stop",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  addStopToRoute
);

router.post(
  "/add-stops-batch",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  addStopsBatch
);


module.exports = router;