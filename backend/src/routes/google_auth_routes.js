const express = require("express");
const { google } = require("googleapis");
const pool = require("../config/database");

const oauth2Client = require("../config/google");

const router = express.Router();

router.get("/google", (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/calendar.events"
        ],
        prompt: "consent"
    });

    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).send("No authorization code received.");
        }

        const { tokens } = await oauth2Client.getToken(code);

        oauth2Client.setCredentials(tokens);

        const refreshToken = tokens.refresh_token;

        if (!refreshToken) {
            return res.status(400).send(
                "No refresh token received from Google."
            );
        }

       const existingCredential = await pool.query(
    `
    SELECT id
    FROM google_calendar_credentials
    LIMIT 1;
    `
);

if (existingCredential.rows.length > 0) {
    await pool.query(
        `
        UPDATE google_calendar_credentials
        SET
            refresh_token = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2;
        `,
        [
            refreshToken,
            existingCredential.rows[0].id
        ]
    );
} else {
    await pool.query(
        `
        INSERT INTO google_calendar_credentials
            (refresh_token)
        VALUES
            ($1);
        `,
        [refreshToken]
    );
}

        res.send("Google Calendar authorization successful!");
    } catch (error) {
        console.error("Google OAuth error:", error);
        res.status(500).send("Google authorization failed.");
    }
});

module.exports = router;