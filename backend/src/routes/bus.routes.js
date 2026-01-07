const express = require("express");
const router = express.Router();
const {
  createBus,
  assignRouteToBus,
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

module.exports = router;
