const pool = require("../config/database");
const { getGoogleCalendar } = require("./google_calendar_service");
const { sendEmail } = require("./gmail_service");

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

    // 1. Check that the customer exists and get email
    const customerResult = await pool.query(
        `
        SELECT customer_id, company_name, email, first_name, last_name
        FROM customers
        WHERE customer_id = $1
        `,
        [customerId]
    );

    if (customerResult.rows.length === 0) {
        throw new Error("Customer not found.");
    }

    const customer = customerResult.rows[0];

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
        [customerId, customer.company_name, negotiationDate, negotiationTime, salesRepId]
    );

    console.log("✅ Negotiation meeting created:", result.rows[0]);

    // 4. Create Google Calendar event with Google Meet link
    const calendar = await getGoogleCalendar();

    const startDateTime = `${negotiationDate}T${negotiationTime}:00`;

    // Negotiation duration: 60 minutes
    const start = new Date(startDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const calendarEvent = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all",

        requestBody: {
            summary: `Negotiation Meeting - ${customer.company_name}`,

            description: `Negotiation meeting with ${customer.company_name}.`,

            start: {
                dateTime: start.toISOString(),
                timeZone: "Asia/Kolkata"
            },

            end: {
                dateTime: end.toISOString(),
                timeZone: "Asia/Kolkata"
            },

            attendees: [
                {
                    email: customer.email
                }
            ],

            conferenceData: {
                createRequest: {
                    requestId: `negotiation-${customerId}-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet"
                    }
                }
            }
        }
    });

    const meetingLink = calendarEvent.data.hangoutLink;

    // 5. Update negotiation meeting with Google Meet link
    await pool.query(
        `
        UPDATE negotiation_meetings
        SET meeting_link = $1
        WHERE negotiation_id = $2
        `,
        [meetingLink, result.rows[0].negotiation_id]
    );

    // 6. Send negotiation meeting confirmation email
    await sendEmail({
        to: customer.email,
        subject: "Your negotiation meeting has been scheduled",
        html: `
            <h2>Your negotiation meeting is confirmed</h2>

            <p>Hi ${customer.first_name},</p>

            <p>
                Your negotiation meeting for ${customer.company_name} has been scheduled.
            </p>

            <p>
                <strong>Date:</strong> ${negotiationDate}<br>
                <strong>Time:</strong> ${negotiationTime}
            </p>

            <p>
                <strong>Google Meet:</strong>
                <a href="${meetingLink}">
                    Join the meeting
                </a>
            </p>

            <p>
                We look forward to discussing the final details with you.
            </p>
        `
    });

    // 7. Update customer stage to Negotiation
    await pool.query(
        `UPDATE customers SET current_stage = 'Negotiation' WHERE customer_id = $1`,
        [customerId]
    );

    // 8. Return meeting details with link
    return {
        ...result.rows[0],
        meeting_link: meetingLink
    };
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