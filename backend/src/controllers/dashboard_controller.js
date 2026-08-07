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

const getRecommendations = async (req, res) => {

    try {

        const recommendations =
            await dashboardService.getRecommendations();

        res.status(200).json(recommendations);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch recommendations."
        });

    }

};
const getPipelineStages = async (req, res) => {

    try {
             const salesRepId = req.params.salesRepId || null;
        const stages = await dashboardService.getPipelineStages(salesRepId);

        res.status(200).json(stages);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch pipeline."
        });

    }

};
const getCompaniesTable = async (req, res) => {

    try {

        const companies =
            await dashboardService.getCompaniesTable();

        res.status(200).json(companies);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch companies."
        });

    }

};

const getCompanyDetails = async (req, res) => {

    try {

        const { customerId } = req.params;

        const company =
            await dashboardService.getCompanyDetails(customerId);

        res.status(200).json(company);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message
        });

    }

};
const getFollowups = async (req, res) => {

    try {

        const followups =
            await dashboardService.getFollowups();

        res.status(200).json(followups);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch follow-ups."
        });

    }

};

module.exports = {
  getDashboardStats,
  getLeads,
  getTrialUsers,
  getRecommendations,
  getPipelineStages,
   getCompaniesTable,
   getCompanyDetails,
   getFollowups
};