const { google } = require("googleapis");
const pool = require("../config/database");
const oauth2Client = require("../config/google");

const sendEmail = async ({ to, subject, html }) => {
    // Get the company's saved Google refresh token
    const result = await pool.query(`
        SELECT refresh_token
        FROM google_calendar_credentials
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("Google account is not authorized.");
    }

    const refreshToken = result.rows[0].refresh_token;

    // Give OAuth client the saved refresh token
    oauth2Client.setCredentials({
        refresh_token: refreshToken
    });

    // Create Gmail API client
    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    // Create email
    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/html; charset=utf-8",
        "",
        html
    ].join("\r\n");

    // Gmail requires the message to be base64url encoded
    const encodedMessage = Buffer
        .from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    // Send email
    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage
        }
    });

    console.log("Email sent successfully:", response.data.id);

    return response.data;
};

module.exports = {
    sendEmail
};