const demoService = require("../services/demo_service");

const createDemoBooking = async (req, res) => {

    try {

        const {
            customer_id,
            demo_date,
            demo_time
        } = req.body;

        // Basic validation
        if (!customer_id || !demo_date || !demo_time) {
            return res.status(400).json({
                message: "customer_id, demo_date and demo_time are required."
            });
        }

        const booking = await demoService.createDemoBooking({
            customerId: customer_id,
            demoDate: demo_date,
            demoTime: demo_time
        });

        res.status(201).json({
            message: "Demo booked successfully.",
            booking
        });

    } catch (error) {

        console.error("Create demo booking error:", error);

        if (error.message === "Customer not found.") {
            return res.status(404).json({
                message: error.message
            });
        }

        if (error.message === "A demo is already booked for this customer.") {
            return res.status(409).json({
                message: error.message
            });
        }

        res.status(500).json({
            message: "Failed to create demo booking."
        });
    }
};
const demoService = require("../services/demo_service");

const getDemoBookings = async (req, res) => {

    try {

        const bookings = await demoService.getDemoBookings();

        res.status(200).json(bookings);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch demo bookings."
        });

    }
};
module.exports = {
    createDemoBooking,
    getDemoBookings
};