/**
 * MOCK Stripe service.
 * No real Stripe test keys yet, so this simulates the Stripe API shape
 * (paymentIntent create/confirm) without calling the real network.
 *
 * When real Stripe keys are available, replace the body of each function
 * with actual calls to the "stripe" npm package, e.g.:
 *   const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
 * The function signatures below can stay the same so paymentController.js
 * does not need to change.
 */

const crypto = require("crypto");

function generateId(prefix) {
  return `${prefix}_${crypto.randomBytes(12).toString("hex")}`;
}

/**
 * Simulates creating a Stripe PaymentIntent.
 */
async function createPaymentIntent({ amount, currency = "lkr" }) {
  return {
    id: generateId("pi"),
    client_secret: generateId("secret"),
    amount,
    currency,
    status: "requires_confirmation",
  };
}

/**
 * Simulates confirming a Stripe PaymentIntent with a card.
 * Fails automatically if the mock card number ends in "0002" (Stripe's
 * own convention for a decline test card), otherwise succeeds.
 */
async function confirmPaymentIntent({ paymentIntentId, cardNumber = "" }) {
  const cleaned = cardNumber.replace(/\s/g, "");
  const isDeclineTestCard = cleaned.endsWith("0002");

  if (isDeclineTestCard) {
    return {
      id: paymentIntentId,
      status: "failed",
      error: {
        code: "card_declined",
        message: "Your card was declined.",
      },
    };
  }

  return {
    id: paymentIntentId,
    status: "succeeded",
    charge_id: generateId("ch"),
  };
}

function generateTransactionId() {
  return generateId("txn").toUpperCase();
}

function generateInvoiceNumber() {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `INV-${stamp}-${random}`;
}

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  generateTransactionId,
  generateInvoiceNumber,
};
