// controllers/paymentController.js

const stripe = require("../config/stripe");
const Payment = require("../models/paymentModel");
const Contract = require("../models/contractModel");

// CREATE PAYMENT INTENT
exports.createPaymentIntent = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // create stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: contract.amount * 100, // convert to cents
      currency: "usd",
      metadata: {
        contractId: contract._id.toString(),
        artistId: contract.artistId.toString(),
        clientId: contract.clientId.toString(),
      },
    });

    // save payment in DB
    const payment = await Payment.create({
      contractId: contract._id,
      artistId: contract.artistId,
      clientId: contract.clientId,
      amount: contract.amount,
      currency: "usd",
      stripePaymentIntentId: paymentIntent.id,
      status: "pending",
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PAYMENT BY ID
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("contractId")
      .populate("artistId")
      .populate("clientId");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// STRIPE WEBHOOK (IMPORTANT)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // PAYMENT SUCCESS
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    await Payment.findOneAndUpdate({ stripePaymentIntentId: paymentIntent.id }, { status: "succeeded" });
  }

  // PAYMENT FAILED
  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;

    await Payment.findOneAndUpdate({ stripePaymentIntentId: paymentIntent.id }, { status: "failed" });
  }

  res.json({ received: true });
};
