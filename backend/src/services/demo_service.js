const pool = require("../config/database");

const createDemoBooking = async ({
    customerId,
    demoDate,
    demoTime
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
            demo_time
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING
            demo_id,
            customer_id,
            demo_date,
            demo_time,
            created_at;
        `,
        [
            customerId,
            demoDate,
            demoTime
        ]
    );

    return result.rows[0];
};

module.exports = {
    createDemoBooking
};