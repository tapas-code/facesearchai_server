const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create a Stripe Checkout Session
router.post("/create-checkout-session", async (req, res) => {
  const { plan } = req.body;

  const prices = {
    starter: 2900, // Price in cents (e.g., $29.00)
    professional: 9900,
    enterprise: 29900,
  };

  const price = prices[plan.toLowerCase()];

  if (!price) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan,
            },
            unit_amount: price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
    });

    console.log("Stripe session created:", session);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Unable to create checkout session" });
  }
});

module.exports = router;
