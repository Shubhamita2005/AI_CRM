const negotiationService = require("../services/negotiation_service");

const createNegotiationMeeting = async (req, res) => {
    try {
        const {
            customer_id,
            negotiation_date,
            negotiation_time,
            sales_rep_id
        } = req.body;

        // ✅ Debug log
        console.log("📥 Controller received negotiation request:", {
            customer_id,
            negotiation_date,
            negotiation_time,
            sales_rep_id
        });

        // Validation
        if (!customer_id || !negotiation_date || !negotiation_time) {
            return res.status(400).json({
                message: "customer_id, negotiation_date and negotiation_time are required."
            });
        }

        const meeting = await negotiationService.createNegotiationMeeting({
            customerId: customer_id,
            negotiationDate: negotiation_date,
            negotiationTime: negotiation_time,
            salesRepId: sales_rep_id
        });

        res.status(201).json({
            message: "Negotiation meeting scheduled successfully.",
            meeting
        });

    } catch (error) {
        console.error("Create negotiation meeting error:", error);

        if (error.message === "Customer not found.") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "A negotiation meeting is already scheduled for this customer.") {
            return res.status(409).json({ message: error.message });
        }

        res.status(500).json({
            message: "Failed to create negotiation meeting."
        });
    }
};

const getNegotiationMeetings = async (req, res) => {
    try {
        const meetings = await negotiationService.getNegotiationMeetings();
        res.status(200).json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch negotiation meetings."
        });
    }
};

module.exports = {
    createNegotiationMeeting,
    getNegotiationMeetings
};