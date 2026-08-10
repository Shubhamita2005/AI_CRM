const pool = require("../config/database");

const createNegotiationMeeting = async ({
    customerId,
    negotiationDate,
    negotiationTime,
    salesRepId
}) => {

    // ✅ Debug log
    console.log("🔍 Negotiation service received:", {
        customerId,
        negotiationDate,
        negotiationTime,
        salesRepId,
        salesRepIdType: typeof salesRepId
    });

    // 1. Check that the customer exists
    const customerResult = await pool.query(
        `SELECT customer_id, company_name FROM customers WHERE customer_id = $1`,
        [customerId]
    );

    if (customerResult.rows.length === 0) {
        throw new Error("Customer not found.");
    }

    const company_name = customerResult.rows[0].company_name;

    // 2. Check if negotiation already exists for this customer
    const existingNegotiation = await pool.query(
        `SELECT negotiation_id FROM negotiation_meetings WHERE customer_id = $1`,
        [customerId]
    );

    if (existingNegotiation.rows.length > 0) {
        throw new Error("A negotiation meeting is already scheduled for this customer.");
    }

    // 3. Create the negotiation meeting
    const result = await pool.query(
        `
        INSERT INTO negotiation_meetings
        (
            customer_id,
            company_name,
            negotiation_date,
            negotiation_time,
            sales_rep_id,
            status
        )
        VALUES ($1, $2, $3, $4, $5, 'scheduled')
        RETURNING
            negotiation_id,
            customer_id,
            company_name,
            negotiation_date,
            negotiation_time,
            sales_rep_id,
            status,
            created_at
        `,
        [customerId, company_name, negotiationDate, negotiationTime, salesRepId]
    );

    console.log("✅ Negotiation meeting created:", result.rows[0]);

    // 4. Update customer stage
    await pool.query(
        `UPDATE customers SET current_stage = 'Negotiation' WHERE customer_id = $1`,
        [customerId]
    );

    return result.rows[0];
};

const getNegotiationMeetings = async () => {
    const result = await pool.query(
        `
        SELECT
            n.negotiation_id,
            n.customer_id,
            n.company_name,
            n.negotiation_date,
            n.negotiation_time,
            n.sales_rep_id,
            n.meeting_link,
            n.status,
            n.notes,
            n.created_at,
            n.completed_at
        FROM negotiation_meetings n
        ORDER BY n.negotiation_date ASC, n.negotiation_time ASC
        `
    );

    return result.rows;
};

module.exports = {
    createNegotiationMeeting,
    getNegotiationMeetings
};