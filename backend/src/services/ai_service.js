const pool = require("../config/database");
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const fetchTrialCustomers = async () => {
    const result = await pool.query(`
        SELECT
            c.customer_id,
            c.company_name,
            c.first_name,
            c.last_name,
            c.email,
            c.industry,
            c.company_size,
            c.country,

            ft.trial_start_date,
            ft.trial_end_date,
            ft.trial_status,
            ft.days_active,
            ft.current_streak,
            ft.total_logins,
            ft.projects_created,
            ft.collaborators_invited,
            ft.storage_used_gb,
            ft.premium_features_used
        FROM free_trials ft
        INNER JOIN customers c
            ON ft.customer_id = c.customer_id;
    `);

    return result.rows;
};
const fetchActivityLogs = async (customerId) => {
    const result = await pool.query(
        `
        SELECT
            activity_type,
            activity_time,
            details
        FROM activity_logs
        WHERE customer_id = $1
        ORDER BY activity_time ASC;
        `,
        [customerId]
    );

    return result.rows;
};

const fetchFollowupHistory = async (customerId) => {
    const result = await pool.query(
        `
        SELECT
            followup_type,
            followup_status,
            followup_date,
            notes
        FROM followup_history
        WHERE customer_id = $1
        ORDER BY followup_date ASC;
        `,
        [customerId]
    );

    return result.rows;
};

const prepareCustomerContext = async (customer) => {

    const activities = await fetchActivityLogs(customer.customer_id);

    const followupHistory = await fetchFollowupHistory(customer.customer_id);

    return {

        customer,

     trial: {
    trial_start_date: customer.trial_start_date,
    trial_end_date: customer.trial_end_date,
    trial_status: customer.trial_status,
    days_active: customer.days_active,
    current_streak: customer.current_streak,
    total_logins: customer.total_logins,
    projects_created: customer.projects_created,
    collaborators_invited: customer.collaborators_invited,
    storage_used_gb: customer.storage_used_gb,
    premium_features_used: customer.premium_features_used,
},

        activities,

        followupHistory

    };

};

const buildPrompt = (context) => {

    return `
You are an expert SaaS Sales Manager for a Project Management Software.

Your task is to analyze the customer and recommend the next best follow-up action.

Customer Information:
Company Name: ${context.customer.company_name}
Customer Name: ${context.customer.first_name} ${context.customer.last_name}
Industry: ${context.customer.industry}
Company Size: ${context.customer.company_size}
Country: ${context.customer.country}

Trial Information:
Trial Status: ${context.trial.trial_status}
Days Active: ${context.trial.days_active}
Current Streak: ${context.trial.current_streak}
Total Logins: ${context.trial.total_logins}
Projects Created: ${context.trial.projects_created}
Collaborators Invited: ${context.trial.collaborators_invited}
Storage Used (GB): ${context.trial.storage_used_gb}
Premium Features Used: ${context.trial.premium_features_used}

Recent Activities:
${JSON.stringify(context.activities, null, 2)}

Previous Follow-ups:
${JSON.stringify(context.followupHistory, null, 2)}

Based on all the above information, recommend the next best follow-up.

Return ONLY a valid JSON object.

Do not include markdown.

Do not wrap the response inside triple backticks or markdown code blocks.

Do not include explanations.

Do not include any extra text.
Priority MUST be exactly one of these values:

High
Medium
Low

Do not use any other value.

Return exactly:

{
  "recommended_action": "",
  "priority": "High | Medium | Low",
  "reason": "",
  "confidence_score": 95,
  "estimated_conversion_probability": 87,
  "recommended_timeframe": ""
}`;
};

const callOpenAI = async (prompt) => {

    const MAX_RETRIES = 3;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await client.models.generateContent({
                model: "gemini-3.5-flash-lite",
                contents: prompt,
            });

            const text = response.text;

            if (!text) {
                throw new Error("Gemini returned an empty response.");
            }

            const cleanedText = text
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            return JSON.parse(cleanedText);

        } catch (error) {

            if (
                error.message.includes("503") &&
                attempt < MAX_RETRIES
            ) {

                console.log(
                    `Gemini busy. Retrying (${attempt}/${MAX_RETRIES})...`
                );

                await new Promise(resolve =>
                    setTimeout(resolve, 5000)
                );

                continue;
            }

            throw error;
        }
    }
};

const validateRecommendation = (recommendation) => {

    const allowedPriorities = ["High", "Medium", "Low"];

    if (!allowedPriorities.includes(recommendation.priority)) {
        recommendation.priority = "Medium";
    }

    return recommendation;
};

const saveRecommendation = async (customerId, recommendation) => {

    await pool.query(
        `
        INSERT INTO followup_recommendations
        (
            customer_id,
            recommended_action,
            priority,
            reason,
            confidence_score,
            estimated_conversion_probability,
            recommended_timeframe,
            status
        )

        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8
        );
        `,
        [
            customerId,
            recommendation.recommended_action,
            recommendation.priority,
            recommendation.reason,
            recommendation.confidence_score,
            recommendation.estimated_conversion_probability,
            recommendation.recommended_timeframe,
            "Pending"
        ]
    );

};

const generateRecommendations = async () => {

    // Delete previous recommendations (for development only)
    // await pool.query("DELETE FROM followup_recommendations;");

    const customers = await fetchTrialCustomers();

    console.log(`Found ${customers.length} trial customers.\n`);

    for (const customer of customers) {

        try {

            console.log(`Processing ${customer.company_name}...`);

            const context = await prepareCustomerContext(customer);

            const prompt = buildPrompt(context);

            let recommendation = await callOpenAI(prompt);
            recommendation = validateRecommendation(recommendation);


            await saveRecommendation(
                customer.customer_id,
                recommendation
            );

            console.log(
                `✓ Recommendation generated for ${customer.company_name}\n`
            );

        } catch (error) {

            console.error(
                `✗ Failed for ${customer.company_name}:`,
                error.message
            );

        }

    }

    console.log("AI recommendation generation completed.");

};

module.exports = {
  fetchTrialCustomers,
    fetchActivityLogs,
    fetchFollowupHistory,
    prepareCustomerContext,
    buildPrompt,
    callOpenAI,
    validateRecommendation,
    saveRecommendation,
    generateRecommendations
};
