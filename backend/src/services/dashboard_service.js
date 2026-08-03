const pool = require("../config/db");

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS "trialUsers"
    FROM free_trial;
  `);

  return result.rows[0];
};

module.exports = {
  getDashboardStats,
};