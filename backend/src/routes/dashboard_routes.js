const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard_controller");

// GET /api/dashboard/stats
router.get("/stats", dashboardController.getDashboardStats);
router.get("/leads", dashboardController.getLeads);
router.get("/trial-users", dashboardController.getTrialUsers);
module.exports = router;