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
    const revenueResult = await pool.query(`
        SELECT
            COALESCE(
                SUM((estimated_conversion_probability / 100.0) * 999),
                0
            ) AS revenue
        FROM followup_recommendations;
    `);

    // Conversion Rate
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

const getPipelineStages = async (salesRepId = null) => {

    let query = `
        SELECT
            customer_id,
            company_name,
            CONCAT(first_name, ' ', last_name) AS full_name,
            current_stage
        FROM customers
        WHERE status = 'Active'
    `;

    const values = [];

    if (salesRepId !== null) {
        query += ` AND sales_rep_id = $1`;
        values.push(salesRepId);
    }

    query += ` ORDER BY company_name`;

    const result = await pool.query(query, values);
    const customers = result.rows;

    return [
        {
            name: "Lead",
            deals: customers
                .filter(c => c.current_stage === "Lead")
                .map(c => ({
                    customer_id: c.customer_id,
                    company: c.company_name,
                    note: c.full_name
                }))
        },
        {
            name: "Trial",
            deals: customers
                .filter(c => c.current_stage === "Trial")
                .map(c => ({
                    customer_id: c.customer_id,
                    company: c.company_name,
                    note: c.full_name
                }))
        },
        {
            name: "Demo Booked",
            deals: customers
                .filter(c => c.current_stage === "Demo Booked")
                .map(c => ({
                    customer_id: c.customer_id,
                    company: c.company_name,
                    note: c.full_name
                }))
        },
        {
            name: "Negotiation",
            deals: customers
                .filter(c => c.current_stage === "Negotiation")
                .map(c => ({
                    customer_id: c.customer_id,
                    company: c.company_name,
                    note: c.full_name
                }))
        },
        {
            name: "Closed Won",
            deals: customers
                .filter(c => c.current_stage === "Subscribed")
                .map(c => ({
                    customer_id: c.customer_id,
                    company: c.company_name,
                    note: c.full_name
                }))
        }
    ];
};

const getCompaniesTable = async (salesRepId = null) => {

    let query = `
        SELECT
            c.customer_id AS id,
            c.company_name AS name,
            c.industry,
            c.company_size AS size,
            c.country AS location,
            c.sales_rep_id,
            c.current_stage AS stage,
            c.status,
            COALESCE(fr.estimated_conversion_probability, 0) AS score
        FROM customers c
        LEFT JOIN followup_recommendations fr
            ON c.customer_id = fr.customer_id
    `;

    const values = [];

    if (salesRepId) {
        query += ` WHERE c.sales_rep_id = $1`;
        values.push(salesRepId);
    }

    query += ` ORDER BY c.company_name;`;

    const result = await pool.query(query, values);
    return result.rows;
};

const getCompanyDetails = async (customerId) => {

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
        recommendation: recommendationResult.rows[0] || null
    };
};

const getFollowups = async (salesRepId = null) => {

    let query = `
        SELECT
            fr.recommendation_id AS id,
            c.customer_id,
            c.company_name AS company,
            fr.followup_type AS action,
            fr.recommended_action AS note,
            fr.recommended_timeframe AS time,
            fr.meeting_type,
            fr.priority
        FROM followup_recommendations fr
        INNER JOIN customers c
            ON fr.customer_id = c.customer_id
        WHERE fr.status = 'Pending'
    `;

    const values = [];

    if (salesRepId) {
        query += ` AND c.sales_rep_id = $1`;
        values.push(salesRepId);
    }

    query += `
        ORDER BY
            CASE fr.priority
                WHEN 'High' THEN 1
                WHEN 'Medium' THEN 2
                WHEN 'Low' THEN 3
            END,
            fr.generated_at DESC
        LIMIT 5;
    `;

    const result = await pool.query(query, values);
    return result.rows;
};

// ✅ NEW: Manager Dashboard Stats
const getManagerDashboardStats = async () => {

    // Total Trial Users
    const trialResult = await pool.query(`
        SELECT COUNT(*) AS count FROM free_trials;
    `);

    // Active Subscriptions
    const subscriptionResult = await pool.query(`
        SELECT COUNT(*) AS count
        FROM subscriptions
        WHERE subscription_status = 'Active';
    `);

    // Revenue Potential
    const revenueResult = await pool.query(`
        SELECT
            COALESCE(
                SUM((estimated_conversion_probability / 100.0) * 999),
                0
            ) AS revenue
        FROM followup_recommendations;
    `);

    // All meetings today
    const todayMeetingsResult = await pool.query(`
        SELECT COUNT(*) AS meeting_count
        FROM (
            SELECT demo_date AS meeting_date
            FROM demo_bookings
            WHERE demo_date = CURRENT_DATE

            UNION ALL

            SELECT negotiation_date AS meeting_date
            FROM negotiation_meetings
            WHERE negotiation_date = CURRENT_DATE
        ) AS combined;
    `);

    const trialUsers = Number(trialResult.rows[0].count);
    const activeSubscriptions = Number(subscriptionResult.rows[0].count);

    const conversionRate =
        trialUsers === 0
            ? 0
            : ((activeSubscriptions / trialUsers) * 100).toFixed(1);

    return {
        trialUsers,
        conversionRate: Number(conversionRate),
        revenuePotential: Math.round(revenueResult.rows[0].revenue),
        meetings: Number(todayMeetingsResult.rows[0].meeting_count)
    };
};

// ✅ NEW: Sales Rep Dashboard Stats
const getSalesDashboardStats = async (salesRepId) => {

    console.log("📊 Calculating stats for sales rep:", salesRepId);

    // ✅ 1. Trial Accounts for this rep
    const trialResult = await pool.query(
        `
        SELECT COUNT(*) AS trial_count
        FROM customers
        WHERE sales_rep_id = $1
        AND current_stage = 'Trial';
        `,
        [salesRepId]
    );

    const trialAccounts = parseInt(trialResult.rows[0].trial_count);

    // ✅ 2. Converted (Subscribed) Accounts for this rep
    const convertedResult = await pool.query(
        `
        SELECT COUNT(*) AS converted_count
        FROM customers
        WHERE sales_rep_id = $1
        AND current_stage = 'Subscribed';
        `,
        [salesRepId]
    );

    const convertedAccounts = parseInt(convertedResult.rows[0].converted_count);

    // ✅ 3. Total Assigned Customers
    const totalResult = await pool.query(
        `
        SELECT COUNT(*) AS total_count
        FROM customers
        WHERE sales_rep_id = $1;
        `,
        [salesRepId]
    );

    const totalCustomers = parseInt(totalResult.rows[0].total_count);

    // ✅ 4. Conversion Rate
    let conversionRate = 0;
    if (totalCustomers > 0) {
        conversionRate = Math.round(
            (convertedAccounts / totalCustomers) * 100
        );
    }

    // ✅ 5. Today's Meetings (Demo + Negotiation)
    const todayMeetingsResult = await pool.query(
        `
        SELECT COUNT(*) AS meeting_count
        FROM (
            SELECT demo_date AS meeting_date
            FROM demo_bookings
            WHERE sales_rep_id = $1
            AND demo_date = CURRENT_DATE

            UNION ALL

            SELECT negotiation_date AS meeting_date
            FROM negotiation_meetings
            WHERE sales_rep_id = $1
            AND negotiation_date = CURRENT_DATE
        ) AS combined;
        `,
        [salesRepId]
    );

    const meetingsToday = parseInt(
        todayMeetingsResult.rows[0].meeting_count
    );

    // ✅ 6. Quota Progress (placeholder)
    const quotaProgress = 0;

    console.log("✅ Stats for rep:", salesRepId, {
        trialAccounts,
        conversionRate,
        quotaProgress,
        meetingsToday
    });

    return {
        trialAccounts,
        conversionRate,
        quotaProgress,
        meetingsToday
    };
};

// ✅ Updated module.exports
module.exports = {
    getDashboardStats,
    getLeads,
    getTrialUsers,
    getRecommendations,
    getPipelineStages,
    getCompaniesTable,
    getCompanyDetails,
    getFollowups,
    getManagerDashboardStats,   // ✅ NEW
    getSalesDashboardStats       // ✅ NEW
};