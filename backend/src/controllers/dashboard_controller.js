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
        const recommendations = await dashboardService.getRecommendations();
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
        const companies = await dashboardService.getCompaniesTable();
        res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch companies."
        });
    }
};

// ✅ Fetch companies by Sales Rep ID (Sales Rep view)
const getCompaniesTableBySalesRep = async (req, res) => {
  try {
    const { salesRepId } = req.query;

    if (!salesRepId) {
      return res.status(400).json({ message: "salesRepId is required" });
    }

    console.log("🏢 Fetching companies for sales rep:", salesRepId);

    const companies = await dashboardService.getCompaniesTableBySalesRep(salesRepId);
    res.status(200).json(companies);
  } catch (error) {
    console.error("Error in getCompaniesTableBySalesRep:", error);
    res.status(500).json({
      message: "Failed to fetch companies for sales rep.",
    });
  }
};

const getCompanyDetails = async (req, res) => {
    try {
        const { customerId } = req.params;
        const company = await dashboardService.getCompanyDetails(customerId);
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
        const salesRepId = req.params.salesRepId || null;
        const followups = await dashboardService.getFollowups(salesRepId);
        res.status(200).json(followups);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch follow-ups."
        });
    }
};

// ✅ NEW: Manager Dashboard Stats
const getManagerDashboardStats = async (req, res) => {
    try {
        const stats = await dashboardService.getManagerDashboardStats();
        res.status(200).json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch manager dashboard stats."
        });
    }
};

// ✅ NEW: Sales Rep Dashboard Stats
const getSalesDashboardStats = async (req, res) => {
    try {
        const { salesRepId } = req.params;

        if (!salesRepId) {
            return res.status(400).json({ message: "salesRepId is required" });
        }

        console.log("📊 Fetching sales stats for rep:", salesRepId);

        const stats = await dashboardService.getSalesDashboardStats(salesRepId);

        res.status(200).json(stats);
    } catch (error) {
        console.error("Error in getSalesDashboardStats:", error);
        res.status(500).json({
            message: "Failed to fetch sales dashboard stats."
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
  getCompaniesTableBySalesRep, 
  getCompanyDetails,
  getFollowups,
  getManagerDashboardStats,     // ✅ Add
  getSalesDashboardStats         // ✅ Add
};