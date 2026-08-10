require("dotenv").config();

const { sendEmail } = require("./src/services/gmail_service");

const test = async () => {
    try {
        await sendEmail({
            to: "ghoshparthiv98@gmail.com",
            subject: "AI CRM Gmail Test",
            html: `
                <h2>Gmail integration is working!</h2>
                <p>This email was sent by the AI CRM backend using the Gmail API.</p>
            `
        });

        console.log("Test email sent successfully.");
    } catch (error) {
        console.error("Test email failed:", error);
    }
};

test();