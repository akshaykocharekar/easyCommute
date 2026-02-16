const express = require("express");
const router = express.Router();
const {
  createRoute,
  getAllRoutes,
  addStopToRoute,
} = require("../controllers/route.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post("/", protect, authorizeRoles("SUPER_ADMIN"), createRoute);
router.get("/", protect, getAllRoutes);
router.post(
  "/add-stop",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  addStopToRoute
);

module.exports = router;
