const pool = require("../config/database");
const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const fetchCustomers = async () => {

    const result = await pool.query(`
        SELECT
            customer_id,
            company_name,
            first_name,
            last_name,
            email,
            industry,
            company_size,
            country,
            current_stage,
            sales_rep_id

        FROM customers

        WHERE status = 'Active'

        ORDER BY customer_id;
    `);

    return result.rows;

};

const fetchTrialInformation = async (customerId) => {

    const result = await pool.query(
        `
        SELECT
            trial_start_date,
            trial_end_date,
            trial_status,
            days_active,
            current_streak,
            total_logins,
            projects_created,
            collaborators_invited,
            storage_used_gb,
            premium_features_used

        FROM free_trials

        WHERE customer_id = $1;
        `,
        [customerId]
    );

    return result.rows[0] || null;

};

const fetchDemoInformation = async (customerId) => {

    const result = await pool.query(
        `
        SELECT
            demo_date,
            demo_time,
            created_at

        FROM demo_bookings

        WHERE customer_id = $1;
        `,
        [customerId]
    );

    return result.rows[0] || null;

};

const fetchNegotiationInformation = async (customerId) => {

    const result = await pool.query(
        `
        SELECT
            negotiation_date,
            negotiation_time,
            created_at

        FROM negotiations

        WHERE customer_id = $1;
        `,
        [customerId]
    );

    return result.rows[0] || null;

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
        ORDER BY activity_time DESC
        LIMIT 10;
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
        ORDER BY followup_date DESC
        LIMIT 5;
        `,
        [customerId]
    );

    return result.rows;
};

const prepareCustomerContext = async (customer) => {

   const [
    trial,
    demo,
    negotiation,
    activities,
    followupHistory
] = await Promise.all([
    fetchTrialInformation(customer.customer_id),
    fetchDemoInformation(customer.customer_id),
    fetchNegotiationInformation(customer.customer_id),
    fetchActivityLogs(customer.customer_id),
    fetchFollowupHistory(customer.customer_id)
]);
   return {

    customer,

    trial,

    demo,

    negotiation,

    activities,

    followupHistory

};

};

const buildPrompt = (context) => {

    return `
You are an experienced SaaS Sales Manager working for a Project Management Software company.

Your goal is to analyze the customer's complete sales journey and recommend the single best next follow-up action that maximizes the chance of converting the customer into a paid subscriber.

Follow these business rules carefully:

• Consider the customer's current pipeline stage before making any recommendation.
• Never recommend booking a demo if a demo has already been completed.
• Never recommend trial onboarding if the customer is already in negotiation.
• If the customer is inactive during the trial, recommend re-engagement.
• If the customer is highly engaged, recommend moving them further in the sales pipeline.
• Base your recommendation only on the information provided.

----------------------------
CUSTOMER INFORMATION
----------------------------

Company Name: ${context.customer.company_name}
Customer Name: ${context.customer.first_name} ${context.customer.last_name}
Industry: ${context.customer.industry}
Company Size: ${context.customer.company_size}
Country: ${context.customer.country}

Current Pipeline Stage:
${context.customer.current_stage}

${
context.trial
? `
----------------------------
TRIAL INFORMATION
----------------------------

Trial Status: ${context.trial.trial_status}
Trial Start Date: ${context.trial.trial_start_date}
Trial End Date: ${context.trial.trial_end_date}

Days Active: ${context.trial.days_active}
Current Streak: ${context.trial.current_streak}
Total Logins: ${context.trial.total_logins}
Projects Created: ${context.trial.projects_created}
Collaborators Invited: ${context.trial.collaborators_invited}
Storage Used (GB): ${context.trial.storage_used_gb}
Premium Features Used: ${context.trial.premium_features_used}
`
: `
Customer is not currently using a free trial.
`
}

${
context.demo
? `
----------------------------
DEMO INFORMATION
----------------------------

Demo Date: ${context.demo.demo_date}
Demo Time: ${context.demo.demo_time}
`
: ""
}

${
context.negotiation
? `
----------------------------
NEGOTIATION INFORMATION
----------------------------

Negotiation Date: ${context.negotiation.negotiation_date}
Negotiation Time: ${context.negotiation.negotiation_time}
`
: ""
}

----------------------------
RECENT ACTIVITY LOGS
----------------------------

${JSON.stringify(context.activities, null, 2)}

----------------------------
RECENT FOLLOW-UP HISTORY
----------------------------

${JSON.stringify(context.followupHistory, null, 2)}

------------------------------------------------

Based on all the above information, recommend the NEXT BEST SALES ACTION.

Return ONLY a valid JSON object.

Do NOT include markdown.

Do NOT include explanations.

Do NOT include code blocks.

Do NOT include any text outside the JSON.

Priority MUST be exactly one of:

High
Medium
Low

Followup Type MUST be exactly one of:

CALL
EMAIL
MEETING

Confidence Score MUST be an integer from 0 to 100.

Estimated Conversion Probability MUST be an integer from 0 to 100.

Return EXACTLY this JSON structure:

{
    "recommended_action": "",
    "followup_type": "CALL | EMAIL | MEETING",
    "priority": "High | Medium | Low",
    "reason": "",
    "confidence_score": 95,
    "estimated_conversion_probability": 87,
    "recommended_timeframe": ""
}
`;
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

try {
    return JSON.parse(cleanedText);
} catch (err) {

    console.log("Invalid JSON received:");
    console.log(cleanedText);

    if (attempt < MAX_RETRIES) {
        console.log("Retrying due to invalid JSON...");
        continue;
    }

    throw err;
}

        } catch (error) {

            if (
    (
        error.message.includes("503") ||
        error.message.includes("429")
    ) &&
    attempt < MAX_RETRIES
) {
            {

                console.log("Waiting 50 seconds...");

                await new Promise(resolve =>
                    setTimeout(resolve, 5000)
                );

                continue;
            }

            throw error;
        }
    }
}
};

const validateRecommendation = (recommendation) => {

    const allowedPriorities = [
        "High",
        "Medium",
        "Low"
    ];

    const allowedFollowupTypes = [
        "CALL",
        "EMAIL",
        "MEETING"
    ];

    if (!allowedPriorities.includes(recommendation.priority)) {
        recommendation.priority = "Medium";
    }

    if (!allowedFollowupTypes.includes(recommendation.followup_type)) {
        recommendation.followup_type = "CALL";
    }

    recommendation.confidence_score =
        Number(recommendation.confidence_score) || 50;

    recommendation.estimated_conversion_probability =
        Number(recommendation.estimated_conversion_probability) || 50;

    return recommendation;

};

const saveRecommendation = async (customerId, recommendation) => {

    await pool.query(
        `
        INSERT INTO followup_recommendations
        (
            customer_id,
            recommended_action,
            followup_type,
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
            $8,
            $9
        );
        `,
        [
            customerId,
            recommendation.recommended_action,
            recommendation.followup_type,
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
    await pool.query("DELETE FROM followup_recommendations;");

    const customers = await fetchCustomers();

    console.log(`Found ${customers.length} active customers.\n`);

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
            await new Promise(resolve =>
    setTimeout(resolve, 5000)
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
  fetchCustomers,
    fetchActivityLogs,
    fetchFollowupHistory,
    prepareCustomerContext,
    buildPrompt,
    callOpenAI,
    validateRecommendation,
    saveRecommendation,
    generateRecommendations,
    fetchTrialInformation,
fetchDemoInformation,
fetchNegotiationInformation,
};
