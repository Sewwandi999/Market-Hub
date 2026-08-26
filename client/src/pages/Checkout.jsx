import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Adjust the base URL / fetch wrapper to match whatever the rest of the
// app already uses (e.g. an axios instance with the auth token attached).
const API_BASE = "/api";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Expecting the order to already be created (Sewwandi's flow) and its id
  // passed in via navigation state, e.g. navigate("/checkout", { state: { orderId, totalAmount } })
  const { orderId, totalAmount } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  async function handlePay(e) {
    e.preventDefault();
    setError("");

    if (!orderId) {
      setError("No order found. Please go back to your cart and checkout again.");
      return;
    }

    setLoading(true);
    try {
      const initiateRes = await fetch(`${API_BASE}/payments/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, paymentMethod }),
      });
      const initiateData = await initiateRes.json();

      if (!initiateRes.ok) {
        throw new Error(initiateData.message || "Could not start payment");
      }

      if (paymentMethod === "cash_on_delivery") {
        navigate("/payment-success", { state: { payment: initiateData.payment } });
        return;
      }

      // card flow - confirm the mock payment intent
      const confirmRes = await fetch(`${API_BASE}/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentId: initiateData.payment._id,
          cardNumber,
        }),
      });
      const confirmData = await confirmRes.json();

      if (!confirmRes.ok) {
        navigate("/payment-failed", {
          state: { reason: confirmData.message, orderId },
        });
        return;
      }

      navigate("/payment-success", { state: { payment: confirmData.payment } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>Order ID: {orderId || "N/A"}</p>
        <p>Total: {totalAmount ? `Rs. ${totalAmount}` : "N/A"}</p>
      </div>

      <form onSubmit={handlePay} className="payment-form">
        <h2>Payment Method</h2>

        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={() => setPaymentMethod("card")}
          />
          Card (Stripe)
        </label>

        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={() => setPaymentMethod("cash_on_delivery")}
          />
          Cash on Delivery
        </label>

        {paymentMethod === "card" && (
          <div className="card-fields">
            <input
              type="text"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required
            />
            <p className="hint">
              Test mode: any card number works. A number ending in 0002
              simulates a decline.
            </p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
