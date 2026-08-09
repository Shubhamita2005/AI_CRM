const express = require("express");

const router = express.Router();

const demoController = require("../controllers/demo_controller");

router.post("/",demoController.createDemoBooking);
router.get("/", demoController.getDemoBookings);

module.exports = router;