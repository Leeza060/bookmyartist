// routes/paymentRoutes.js

const router = require("express").Router();

const { createPaymentIntent, getPayment, stripeWebhook } = require("../controllers/paymentController");

// create payment
router.post("/create-payment-intent", createPaymentIntent);

// get payment
router.get("/:id", getPayment);

// stripe webhook (IMPORTANT - no JSON parser here)
router.post("/webhook", require("express").raw({ type: "application/json" }), stripeWebhook);

module.exports = router;
