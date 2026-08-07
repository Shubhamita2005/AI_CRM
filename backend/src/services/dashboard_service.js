const pool = require("../config/database");

const getDashboardStats = async () => {

    // Trial Users
    const trialResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM free_trials;
    `);

    // Pending Follow-ups (your "Meetings" card for now)
    const pendingResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM followup_recommendations
        WHERE status = 'Pending';
    `);

    // Revenue Potential
    // Assuming premium plan price = ₹999
    const revenueResult = await pool.query(`
        SELECT
            COALESCE(
                SUM((estimated_conversion_probability / 100.0) * 999),
                0
            ) AS revenue
        FROM followup_recommendations;
    `);

    // Conversion Rate
    // You don't have subscriptions yet, so return 0.
     const subscriptionResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM subscriptions
        WHERE subscription_status = 'Active';
    `);
    const trialUsers = Number(trialResult.rows[0].count);
         const activeSubscriptions = Number(subscriptionResult.rows[0].count);
        
         const conversionRate =
        trialUsers === 0
            ? 0
            : ((activeSubscriptions / trialUsers) * 100).toFixed(1);


    return {
        trialUsers: Number(trialResult.rows[0].count),
        conversionRate: Number(conversionRate),
        revenuePotential: Math.round(revenueResult.rows[0].revenue),
        meetings: Number(pendingResult.rows[0].count)
    };
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

const getRecommendations = async () => {

    const result = await pool.query(`
        SELECT
            fr.recommendation_id,
            fr.customer_id,
            c.company_name,
            c.first_name,
            c.last_name,
            fr.recommended_action,
            fr.priority,
            fr.reason,
            fr.confidence_score,
            fr.estimated_conversion_probability,
            fr.recommended_timeframe,
            fr.status,
            fr.generated_at

        FROM followup_recommendations fr

        INNER JOIN customers c
            ON fr.customer_id = c.customer_id

        ORDER BY fr.generated_at DESC;
    `);

    return result.rows;
};
const getPipelineStages = async () => {

    const result = await pool.query(`
        SELECT
            customer_id,
            company_name,
            CONCAT(first_name, ' ', last_name) AS full_name,
            current_stage

        FROM customers

        WHERE status = 'Active'

        ORDER BY company_name;
    `);

    const customers = result.rows;

    return [

        {
            name: "Lead",
            deals: customers
                .filter(customer => customer.current_stage === "Lead")
                .map(customer => ({
                    customer_id: customer.customer_id,
                    company: customer.company_name,
                    note: customer.full_name
                }))
        },

        {
            name: "Trial",
            deals: customers
                .filter(customer => customer.current_stage === "Trial")
                .map(customer => ({
                    customer_id: customer.customer_id,
                    company: customer.company_name,
                    note: customer.full_name
                }))
        },

        {
            name: "Demo Booked",
            deals: customers
                .filter(customer => customer.current_stage === "Demo Booked")
                .map(customer => ({
                    customer_id: customer.customer_id,
                    company: customer.company_name,
                    note: customer.full_name
                }))
        },

        {
            name: "Negotiation",
            deals: customers
                .filter(customer => customer.current_stage === "Negotiation")
                .map(customer => ({
                    customer_id: customer.customer_id,
                    company: customer.company_name,
                    note: customer.full_name
                }))
        },

        {
            name: "Closed Won",
            deals: customers
                .filter(customer => customer.current_stage === "Subscribed")
                .map(customer => ({
                    customer_id: customer.customer_id,
                    company: customer.company_name,
                    note: customer.full_name
                }))
        }

    ];

};
const getCompaniesTable = async () => {

    const result = await pool.query(`
        SELECT
            c.customer_id AS id,
            c.company_name AS name,
            c.industry,
            c.company_size AS size,
            c.country AS location,

            COALESCE(
                fr.estimated_conversion_probability,
                0
            ) AS score

        FROM customers c

        LEFT JOIN followup_recommendations fr
            ON c.customer_id = fr.customer_id

        ORDER BY c.company_name;
    `);

    return result.rows;
};

const getCompanyDetails = async (customerId) => {

    // Customer + Trial Information
    const customerResult = await pool.query(
        `
        SELECT
            c.customer_id,
            c.company_name,
            c.first_name,
            c.last_name,
            c.email,
            c.industry,
            c.company_size,
            c.country,
            c.created_at,

            ft.trial_start_date,
            ft.trial_end_date,
            ft.trial_status,
            ft.days_active,
            ft.current_streak,
            ft.total_logins,
            ft.projects_created,
            ft.collaborators_invited,
            ft.storage_used_gb,
            ft.premium_features_used

        FROM customers c

        LEFT JOIN free_trials ft
            ON c.customer_id = ft.customer_id

        WHERE c.customer_id = $1;
        `,
        [customerId]
    );

    if (customerResult.rows.length === 0) {
        throw new Error("Customer not found.");
    }

    // Activity Logs
    const activityResult = await pool.query(
        `
        SELECT
            activity_type,
            activity_time,
            details

        FROM activity_logs

        WHERE customer_id = $1

        ORDER BY activity_time DESC;
        `,
        [customerId]
    );

    // Follow-up History
    const historyResult = await pool.query(
        `
        SELECT
            followup_type,
            followup_status,
            followup_date,
            notes

        FROM followup_history

        WHERE customer_id = $1

        ORDER BY followup_date DESC;
        `,
        [customerId]
    );

    // Latest AI Recommendation
    const recommendationResult = await pool.query(
        `
        SELECT
            recommended_action,
            priority,
            reason,
            confidence_score,
            estimated_conversion_probability,
            recommended_timeframe,
            status,
            generated_at

        FROM followup_recommendations

        WHERE customer_id = $1

        ORDER BY generated_at DESC

        LIMIT 1;
        `,
        [customerId]
    );

    return {

        customer: customerResult.rows[0],

        activities: activityResult.rows,

        followupHistory: historyResult.rows,

        recommendation:
            recommendationResult.rows[0] || null

    };

};
const getFollowups = async () => {

    const result = await pool.query(`
        SELECT
            fr.recommendation_id AS id,
            c.company_name AS company,
            fr.recommended_action AS action,
            fr.reason AS note,
            fr.recommended_timeframe AS time,
            fr.priority

        FROM followup_recommendations fr

        INNER JOIN customers c
            ON fr.customer_id = c.customer_id

        WHERE fr.status = 'Pending'

        ORDER BY
            CASE fr.priority
                WHEN 'High' THEN 1
                WHEN 'Medium' THEN 2
                WHEN 'Low' THEN 3
            END,
            fr.generated_at DESC

        LIMIT 5;
    `);

    return result.rows;

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
