const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard_controller");

// GET /api/dashboard/stats
router.get("/stats", dashboard_Controller.getDashboardStats);

module.exports = router;