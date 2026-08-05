const dashboardService = require("../services/dashboard_service");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();

    res.status(200).json(stats);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics.",
    });
  }
};

const getLeads = async (req, res) => {
    try {
        const leads = await dashboardService.getLeads();

        res.status(200).json(leads);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch leads."
        });
    }
};

const getTrialUsers = async (req, res) => {
    try {
        const trialUsers = await dashboardService.getTrialUsers();

        res.status(200).json(trialUsers);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch trial users."
        });
    }
};

module.exports = {
  getDashboardStats,
  getLeads,
  getTrialUsers,
};