const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  createSupportRequest,
  getMySupportRequests,
  getAllSupportRequests,
  updateSupportRequestStatus,
} = require("../controllers/support.controller");

// Operator
router.post("/", protect, authorizeRoles("BUS_OPERATOR"), createSupportRequest);
router.get("/mine", protect, authorizeRoles("BUS_OPERATOR"), getMySupportRequests);

// Admin
router.get("/", protect, authorizeRoles("SUPER_ADMIN"), getAllSupportRequests);
router.patch("/:id", protect, authorizeRoles("SUPER_ADMIN"), updateSupportRequestStatus);

module.exports = router;

