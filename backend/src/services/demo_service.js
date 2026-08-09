const pool = require("../config/database");

const createDemoBooking = async ({
    customerId,
    demoDate,
    demoTime,
    salesRepId
}) => {

    // 1. Check that the customer exists
    const customerResult = await pool.query(
        `
        SELECT customer_id
        FROM customers
        WHERE customer_id = $1;
        `,
        [customerId]
    );

    if (customerResult.rows.length === 0) {
        throw new Error("Customer not found.");
    }

    // 2. Check whether this customer already has a demo booking
    const existingDemo = await pool.query(
        `
        SELECT demo_id
        FROM demo_bookings
        WHERE customer_id = $1;
        `,
        [customerId]
    );

    if (existingDemo.rows.length > 0) {
        throw new Error("A demo is already booked for this customer.");
    }

    // 3. Create the demo booking
    const result = await pool.query(
        `
        INSERT INTO demo_bookings
        (
            customer_id,
            demo_date,
            demo_time,
            sales_rep_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4
        )
        RETURNING
            demo_id,
            customer_id,
            demo_date,
            demo_time,
            sales_rep_id,
            created_at;
        `,
        [
            customerId,
            demoDate,
            demoTime,
            salesRepId
        ]
    );
await pool.query(
    `
    UPDATE customers
    SET current_stage = 'Demo Booked'
    WHERE customer_id = $1;
    `,
    [customerId]
);
    return result.rows[0];
};
const getDemoBookings = async () => {

    const result = await pool.query(
        `
        SELECT
            d.demo_id,
            d.customer_id,
            c.company_name,
            c.first_name,
            c.last_name,
            d.sales_rep_id,
            d.demo_date,
            d.demo_time,
            d.meeting_link,
            d.status,
            d.created_at,
            d.completed_at

        FROM demo_bookings d

        INNER JOIN customers c
            ON d.customer_id = c.customer_id

        ORDER BY d.demo_date ASC, d.demo_time ASC;
        `
    );

    return result.rows;
};

module.exports = {
    createDemoBooking,
      getDemoBookings
};