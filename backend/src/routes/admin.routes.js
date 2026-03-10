const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const {
  getAdminStats,
  getUsers,
  deleteUser,
  grantPremium,
  getOperators,
  getIntegrityReport,
  verifyOperator,
  rejectOperator,
} = require("../controllers/admin.controller");

router.get("/stats", protect, authorizeRoles("SUPER_ADMIN"), getAdminStats);
router.get("/users", protect, authorizeRoles("SUPER_ADMIN"), getUsers);
router.delete("/users/:id", protect, authorizeRoles("SUPER_ADMIN"), deleteUser);
router.put("/users/:id/premium", protect, authorizeRoles("SUPER_ADMIN"), grantPremium);
router.get("/operators", protect, authorizeRoles("SUPER_ADMIN"), getOperators);
router.patch("/operators/:id/verify", protect, authorizeRoles("SUPER_ADMIN"), verifyOperator);
router.patch("/operators/:id/reject", protect, authorizeRoles("SUPER_ADMIN"), rejectOperator);
router.get("/integrity", protect, authorizeRoles("SUPER_ADMIN"), getIntegrityReport);

module.exports = router;


