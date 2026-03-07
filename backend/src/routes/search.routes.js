const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth.middleware");
const { searchRoutes } = require("../controllers/search.controller");

router.get("/", protect, searchRoutes);

module.exports = router;