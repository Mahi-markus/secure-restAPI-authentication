const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Transaction = require("../models/transaction.model");

exports.checkout = async (req, res) => {
  const { amount, currency } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: req.user._id.toString() },
    });

    const transaction = new Transaction({
      userId: req.user._id,
      amount,
      currency,
      status: "success",
    });

    await transaction.save();
    res.json({ message: "Payment successful", transaction });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
