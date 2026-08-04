const pool = require("../config/database");

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS "trialUsers"
    FROM free_trials;
  `);

  return result.rows[0];
};

module.exports = {
  getDashboardStats,
};