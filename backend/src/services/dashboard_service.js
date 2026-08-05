const pool = require("../config/database");

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) AS "trialUsers"
    FROM free_trials;
  `);

  return result.rows[0];
};

const getLeads = async () => {
    const result = await pool.query(`
        SELECT
            customer_id,
            company_name,
            CONCAT(first_name, ' ', last_name) AS full_name
        FROM customers;
    `);

    return result.rows;
};

const getTrialUsers = async () => {
    const result = await pool.query(`
        SELECT
            c.customer_id,
            c.company_name,
            CONCAT(c.first_name, ' ', c.last_name) AS full_name
        FROM free_trials ft
        INNER JOIN customers c
            ON ft.customer_id = c.customer_id;
    `);

    return result.rows;
};
module.exports = {
  getDashboardStats,
  getLeads,
  getTrialUsers,
};