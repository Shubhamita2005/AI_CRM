const express = require("express");
const router = express.Router();
const negotiationController = require("../controllers/negotiation_controller");

router.post("/", negotiationController.createNegotiationMeeting);
router.get("/", negotiationController.getNegotiationMeetings);

module.exports = router;