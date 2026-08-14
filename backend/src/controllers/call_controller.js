const callService = require("../services/call_service");

const getCustomerPhone = async (req, res) => {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: "customerId is required." });
    }

    console.log("📞 Fetching phone number for customer:", customerId);

    const data = await callService.getCustomerPhone(customerId);
    res.status(200).json(data);

  } catch (error) {
    console.error("Get customer phone error:", error);

    if (error.message === "Customer not found.") {
      return res.status(404).json({ message: error.message });
    }

    if (error.message === "Customer phone number not found.") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Failed to get customer phone number." });
  }
};

module.exports = {
  getCustomerPhone
};