const express = require("express");
const router = express.Router();
const callController = require("../controllers/call_controller");

router.get("/phone/:customerId", callController.getCustomerPhone);

module.exports = router;