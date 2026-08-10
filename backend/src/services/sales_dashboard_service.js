const pool = require("../config/database");

const getSalesDashboardStats = async (salesRepId) => {

    console.log("📊 Fetching stats for sales rep:", salesRepId);

    // ✅ 1. Trial Accounts
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

    // ✅ 2. Converted Accounts
    const convertedResult = await pool.query(
        `
        SELECT COUNT(*) AS converted_count
        FROM customers
        WHERE sales_rep_id = $1
        AND current_stage = 'Closed Won';
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
        conversionRate = Math.round((convertedAccounts / totalCustomers) * 100);
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

    const meetingsToday = parseInt(todayMeetingsResult.rows[0].meeting_count);

    // ✅ 6. Quota Progress (placeholder for now)
    const quotaProgress = 0; // You can calculate this later

    return {
        trialAccounts,
        conversionRate,
        quotaProgress,
        meetingsToday
    };
};

module.exports = {
    getSalesDashboardStats
};