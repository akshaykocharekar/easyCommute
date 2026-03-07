const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

const { getUsers, promoteOperator } = require("../controllers/user.controller");

router.get("/", protect, authorizeRoles("SUPER_ADMIN"), getUsers);

router.post(
  "/promote",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  promoteOperator
);

module.exports = router;
