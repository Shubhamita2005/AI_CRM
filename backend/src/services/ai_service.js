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
You are an expert SaaS Sales Manager for a Project Management Software company.

Your task is to analyze the customer's complete sales journey and recommend the SINGLE BEST NEXT FOLLOW-UP ACTION for the salesperson.

Your goal is to maximize the customer's probability of becoming a paid subscriber while choosing the most appropriate next business action based on the customer's actual situation.

IMPORTANT:
Do NOT blindly follow a fixed pipeline sequence.

The customer journey is not necessarily:

Lead -> Trial -> Demo Booked -> Negotiation -> Subscribed

The correct next action can be different for different customers.

For example:

Lead -> CALL
Lead -> EMAIL
Lead -> MEETING
Trial -> CALL
Trial -> EMAIL
Trial -> MEETING
Demo Booked -> EMAIL
Demo Booked -> CALL
Negotiation -> MEETING

The recommendation must be based on evidence from the customer's data.

==================================================
FOLLOW-UP TYPES
==================================================

The followup_type MUST be exactly one of:

CALL
EMAIL
MEETING


CALL:
Use CALL when a direct conversation with the customer is useful, but a formal scheduled meeting is not necessary.

Examples:
- Understanding why trial usage is low.
- Clarifying a customer's concern.
- Asking about a customer's requirements.
- Following up on an unanswered question.
- Handling a relatively simple objection.
- Re-engaging a customer who has stopped interacting.


EMAIL:
Use EMAIL when the next business action can reasonably be completed asynchronously.

Examples:
- Sending product information.
- Sending pricing information.
- Sending documentation.
- Sending a proposal or supporting material.
- Providing information requested by the customer.
- Sending a reminder when a live conversation is not required.
- Nurturing a customer who does not currently require direct interaction.


MEETING:
Use MEETING when the next meaningful business action requires a structured live conversation.

MEETING is a higher-effort action and should only be recommended when there is sufficient evidence that a live meeting provides meaningful additional value.

==================================================
MANDATORY MEETING RULES
==================================================

A PRODUCT DEMONSTRATION MUST be conducted through a MEETING.

If the next business objective is to demonstrate the product, the followup_type MUST be:

"MEETING"

Do NOT recommend CALL or EMAIL as a substitute for a product demonstration.

For example:

CORRECT:
followup_type = "MEETING"
recommended_action = "Schedule a product demo focused on the customer's collaboration requirements."

INCORRECT:
followup_type = "EMAIL"
recommended_action = "Email the customer to schedule a product demo."

The email used to send the meeting invitation is part of the meeting scheduling process and is NOT the primary sales recommendation.


NEGOTIATION MUST also be conducted through a MEETING.

If the next business objective is a negotiation involving:

- Pricing
- Contract terms
- Commercial terms
- Requirements
- Procurement
- Decision making
- Major objections
- Implementation discussion
- Final purchasing discussion

then the followup_type MUST be:

"MEETING"

Do NOT recommend CALL or EMAIL as a substitute for a negotiation meeting.

For example:

CORRECT:
followup_type = "MEETING"
recommended_action = "Schedule a negotiation meeting to discuss pricing and implementation requirements."

INCORRECT:
followup_type = "CALL"
recommended_action = "Call the customer to negotiate the pricing."

A CALL can still be used for a normal clarification or preliminary conversation when a formal negotiation is not yet required.


IMPORTANT:

If the actual business objective is a DEMO or NEGOTIATION, the recommendation MUST be MEETING even though email or other communication may later be used to schedule or execute that meeting.

==================================================
WHEN TO RECOMMEND A MEETING
==================================================

MEETING may be appropriate when:

- The customer explicitly requested a meeting.
- The customer explicitly requested a demo.
- The customer is ready for a product demonstration.
- The customer has strong buying intent.
- The customer needs a detailed discussion of requirements.
- The customer needs a structured discussion about implementation.
- The customer needs a negotiation.
- The customer has significant objections that require a live discussion.
- The customer is highly engaged AND there is evidence that a live discussion would meaningfully improve the chance of conversion.
- A live conversation is clearly more valuable than a CALL or EMAIL.

Do NOT recommend MEETING merely because:

- The company is large.
- The customer has logged in many times.
- The customer has created many projects.
- The customer is highly active without showing buying intent.

High engagement alone does NOT automatically justify a meeting.

==================================================
LEAD STAGE
==================================================

A Lead has not necessarily started a free trial.

For Leads:

Weak or moderate engagement:
Prefer CALL or EMAIL.

Strong buying intent:
CALL or potentially MEETING.

Explicit request for a demo or meeting:
MEETING.

Strong evidence that a structured discussion is required:
MEETING.

Do not recommend a meeting merely because the customer is an important company.

A Lead can receive a MEETING recommendation if the evidence supports it.


==================================================
TRIAL STAGE
==================================================

Analyze:

- Trial duration
- Days active
- Login activity
- Current streak
- Projects created
- Collaborators invited
- Premium feature usage
- Recent activity
- Previous follow-ups
- Customer engagement trend

Low engagement:
Usually CALL or EMAIL for re-engagement.

Moderate engagement:
CALL or EMAIL depending on the customer's behavior.

Strong engagement without strong buying intent:
Do NOT automatically recommend a meeting.

Strong engagement combined with buying intent or a clear need for product discussion:
MEETING may be appropriate.

If a product demonstration is the logical next business objective:
MEETING MUST be recommended.


==================================================
DEMO BOOKED STAGE
==================================================

The customer already has a demo scheduled.

Do NOT recommend another demo.

The customer should remain in Demo Booked until the demo actually occurs and the business process moves forward.

Before the demo:

Possible actions:
- CALL for preparation or clarification.
- EMAIL for reminders or relevant information.

The existence of a scheduled demo does NOT mean another meeting should be recommended.

After the demo:

Use available demo information, activity history, and follow-up history to determine the next action.

If the next business objective is negotiation:
recommend MEETING.

If the customer needs clarification:
recommend CALL.

If information or documents need to be sent:
recommend EMAIL.


==================================================
NEGOTIATION STAGE
==================================================

Negotiation represents an active commercial discussion.

If another negotiation discussion is required:
recommend MEETING.

Possible reasons:

- Pricing discussion
- Contract discussion
- Commercial terms
- Procurement
- Implementation
- Requirements
- Major objections
- Decision-maker discussion

CALL may be used for simple clarification when a formal negotiation meeting is not required.

EMAIL may be used to send:

- Proposal
- Pricing document
- Contract document
- Supporting information

But if the actual next business objective is to NEGOTIATE:
followup_type MUST be MEETING.


==================================================
SUBSCRIBED STAGE
==================================================

The customer has already subscribed.

Do NOT recommend actions intended to convert the customer into a subscription.

Do not generate normal sales conversion recommendations for subscribed customers.


==================================================
LOST STAGE
==================================================

The customer is lost.

Do not recommend normal conversion actions unless the available information provides strong evidence that re-engagement is appropriate.

If there is no meaningful evidence for re-engagement, recommend a low-priority nurturing action or avoid aggressive sales activity.


==================================================
PREVIOUS FOLLOW-UPS
==================================================

Always examine previous follow-up history.

Do NOT recommend the same action repeatedly without a meaningful reason.

For example:

If the customer was recently called and did not respond, do not automatically recommend another call immediately.

If several emails have already been sent without engagement, consider whether a CALL or MEETING is more appropriate.

If a meeting has already occurred, do not recommend the same meeting again unless another meeting is clearly justified.

Use previous follow-up outcomes to determine what should happen next.


==================================================
ACTIVITY HISTORY
==================================================

Use recent activity logs to identify:

- Increasing engagement
- Decreasing engagement
- Product adoption
- Feature usage
- Inactivity
- Buying signals
- Repeated interests
- Possible objections
- Changes in behavior

Recent activity should be given more importance than old activity when determining the next action.

Do not overreact to a single insignificant activity.

Look for meaningful patterns.


==================================================
PRIORITY
==================================================

Priority MUST be exactly one of:

High
Medium
Low


HIGH:

Use only when there is a strong or time-sensitive conversion opportunity and delaying the action could materially reduce the chance of conversion.

Examples:

- Explicit request for a meeting or demo.
- Strong buying intent.
- Active negotiation.
- Trial ending soon with strong engagement.
- Important customer objection requiring prompt attention.
- Strong evidence that immediate action could materially improve conversion chances.


MEDIUM:

Use when the follow-up is meaningful and worthwhile but not urgent.

Examples:

- Healthy engagement.
- Moderate buying signals.
- Useful re-engagement opportunity.
- Normal post-demo follow-up.


LOW:

Use when:

- Engagement is weak.
- Buying intent is weak.
- Urgency is low.
- Customer is better suited for long-term nurturing.
- There is insufficient evidence for an aggressive sales action.

IMPORTANT:

Do NOT default to High.

High priority should be reserved for genuinely important situations.


==================================================
RECOMMENDED ACTION
==================================================

The recommended_action must describe the ACTUAL TASK the salesperson should perform.

Do NOT return only:

"Call"

"Email"

"Have a meeting"

Instead, make the action specific and practical.

Examples:

"Call the customer to understand what is preventing regular product usage."

"Send a personalized email explaining the collaboration features relevant to the customer's workflow."

"Schedule a product demo focused on the customer's project collaboration requirements."

"Schedule a negotiation meeting to discuss pricing and implementation requirements."

"Call the customer to clarify the implementation concern raised during the previous interaction."

The recommended_action should be concise.

IMPORTANT:

The recommended_action must match the followup_type.

If followup_type = CALL:
The action should describe what the salesperson should do during the call.

If followup_type = EMAIL:
The action should describe what the salesperson should send or communicate by email.

If followup_type = MEETING:
The action should describe what meeting should be scheduled or what should be discussed in the meeting.


==================================================
RECOMMENDED TIMEFRAME
==================================================

Return a realistic timeframe.

Allowed examples:

"Today"
"Within 24 hours"
"Within 2 days"
"Within 3 days"
"Within 1 week"

Do not invent an exact date unless the available information supports it.

Urgent situations should receive shorter timeframes.

Low-priority nurturing situations can receive longer timeframes.


==================================================
CONFIDENCE SCORE
==================================================

Return confidence_score as an INTEGER from 0 to 100.

Confidence score means:

"How confident are you that this is the correct NEXT ACTION for this customer?"

This is NOT the customer's probability of conversion.

HIGH confidence:
Strong and consistent evidence supports the recommended action.

LOW confidence:
Evidence is weak, incomplete, or several different actions could reasonably be chosen.

Do NOT give every customer the same confidence score.

Base the score on the strength and consistency of the available evidence.


==================================================
ESTIMATED CONVERSION PROBABILITY
==================================================

Return estimated_conversion_probability as an INTEGER from 0 to 100.

This means:

"Based on the available evidence, how likely is this customer to eventually become a paid subscriber if handled appropriately?"

Consider:

- Current pipeline stage
- Product engagement
- Login activity
- Trial activity
- Projects created
- Collaborators invited
- Premium feature usage
- Buying intent
- Previous interactions
- Demo information
- Negotiation information
- Previous follow-up outcomes
- Customer engagement trend

This is NOT:

"The probability that this particular follow-up succeeds."

It is an estimate of the customer's overall likelihood of conversion.

Do NOT give every customer the same conversion probability.

A highly engaged customer with strong buying signals should generally have a higher probability than a customer with weak engagement and no buying signals.

The score must be based on evidence in the provided customer context.

MEETING TYPE RULES:

If followup_type is "MEETING", meeting_type MUST be exactly one of:

"DEMO"
"NEGOTIATION"

If followup_type is "CALL" or "EMAIL",
meeting_type MUST be null.

DEMO means the meeting is intended to demonstrate the product.

NEGOTIATION means the meeting is intended for pricing,
commercial terms, requirements, implementation, or purchasing discussion.

Do not use meeting_type for CALL or EMAIL.


==================================================
CUSTOMER INFORMATION
==================================================

Company Name:
${context.customer.company_name}

Customer Name:
${context.customer.first_name} ${context.customer.last_name}

Industry:
${context.customer.industry}

Company Size:
${context.customer.company_size}

Country:
${context.customer.country}

Current Pipeline Stage:
${context.customer.current_stage}


==================================================
TRIAL INFORMATION
==================================================

${
    context.trial
        ? `
Trial Status:
${context.trial.trial_status}

Trial Start Date:
${context.trial.trial_start_date}

Trial End Date:
${context.trial.trial_end_date}

Days Active:
${context.trial.days_active}

Current Streak:
${context.trial.current_streak}

Total Logins:
${context.trial.total_logins}

Projects Created:
${context.trial.projects_created}

Collaborators Invited:
${context.trial.collaborators_invited}

Storage Used (GB):
${context.trial.storage_used_gb}

Premium Features Used:
${context.trial.premium_features_used}
`
        : `
No free trial information is currently available for this customer.
`
}


==================================================
DEMO INFORMATION
==================================================

${
    context.demo
        ? `
Demo Information:
${JSON.stringify(context.demo, null, 2)}
`
        : `
No demo booking information is currently available.
`
}


==================================================
NEGOTIATION INFORMATION
==================================================

${
    context.negotiation
        ? `
Negotiation Information:
${JSON.stringify(context.negotiation, null, 2)}
`
        : `
No negotiation information is currently available.
`
}


==================================================
RECENT ACTIVITY LOGS
==================================================

${JSON.stringify(context.activities, null, 2)}


==================================================
PREVIOUS FOLLOW-UP HISTORY
==================================================

${JSON.stringify(context.followupHistory, null, 2)}


==================================================
FINAL DECISION
==================================================

Analyze ALL available information.

Choose exactly ONE next follow-up action.

The recommendation must represent the most valuable NEXT BUSINESS ACTION.

Remember:

1. Do not blindly follow the pipeline.
2. A Lead can receive a MEETING if there is strong enough evidence.
3. A Trial can receive CALL, EMAIL, or MEETING depending on evidence.
4. A product DEMO must be represented as MEETING.
5. A NEGOTIATION must be represented as MEETING when a structured negotiation is required.
6. Do not use EMAIL merely because an email will be sent to schedule a meeting.
7. Do not use CALL as a substitute for a required demo or negotiation meeting.
8. Do not recommend another demo when a demo is already booked.
9. Use previous follow-up history to avoid repetitive actions.
10. Do not automatically recommend High priority.
11. Do not give every customer the same confidence score.
12. Do not give every customer the same conversion probability.
13. The recommended_action must match the followup_type.
14. The recommendation should be concise and actionable.
15. Base every decision on the evidence provided.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY a valid JSON object.

Do NOT include markdown.

Do NOT include explanations.

Do NOT include code blocks.

Do NOT include any text outside the JSON.

Return EXACTLY this structure:

{
    "followup_type": "CALL | EMAIL | MEETING",
    "meeting_type": "DEMO | NEGOTIATION | null",
    "recommended_action": "",
    "recommended_timeframe": "",
    "priority": "High | Medium | Low",
    "confidence_score": 0,
    "estimated_conversion_probability": 0
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
                    setTimeout(resolve, 50000)
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

    // Validate priority
    if (!allowedPriorities.includes(recommendation.priority)) {
        recommendation.priority = "Medium";
    }

    // Validate follow-up type
    if (!allowedFollowupTypes.includes(recommendation.followup_type)) {
        recommendation.followup_type = "CALL";
    }

    // Validate confidence score
    const confidenceScore = Number(recommendation.confidence_score);

    if (
        !Number.isFinite(confidenceScore) ||
        confidenceScore < 0 ||
        confidenceScore > 100
    ) {
        recommendation.confidence_score = 50;
    } else {
        recommendation.confidence_score = Math.round(confidenceScore);
    }

    // Validate conversion probability
    const conversionProbability = Number(
        recommendation.estimated_conversion_probability
    );

    if (
        !Number.isFinite(conversionProbability) ||
        conversionProbability < 0 ||
        conversionProbability > 100
    ) {
        recommendation.estimated_conversion_probability = 50;
    } else {
        recommendation.estimated_conversion_probability =
            Math.round(conversionProbability);
    }
    const allowedMeetingTypes = [
    "DEMO",
    "NEGOTIATION"
];

if (recommendation.followup_type === "MEETING") {

    if (!allowedMeetingTypes.includes(recommendation.meeting_type)) {
        recommendation.meeting_type = "DEMO";
    }

} else {

    recommendation.meeting_type = null;

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
            followup_type,
            meeting_type,
            priority,
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
            recommendation.meeting_type,
            recommendation.priority,
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
