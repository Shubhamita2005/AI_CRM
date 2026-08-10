const express = require("express");
const { google } = require("googleapis");

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
    console.log("OAuth callback query:", req.query);

    const { code } = req.query;

    if (!code) {
      return res.status(400).send("No authorization code received from Google.");
    }

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    res.send("Google Calendar authorization successful!");
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).send("Google authorization failed.");
  }
});

module.exports = router;