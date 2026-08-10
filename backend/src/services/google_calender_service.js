const { google } = require("googleapis");
const pool = require("../config/database");

async function getGoogleCalendar() {
    const result = await pool.query(
        `
        SELECT refresh_token
        FROM google_calendar_credentials
        ORDER BY id DESC
        LIMIT 1;
        `
    );

    if (result.rows.length === 0) {
        throw new Error("Google Calendar is not authorized.");
    }

    const refreshToken = result.rows[0].refresh_token;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    return google.calendar({
        version: "v3",
        auth: oauth2Client
    });
}

module.exports = {
    getGoogleCalendar
};