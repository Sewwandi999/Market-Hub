import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payment } = location.state || {};

  return (
    <div className="payment-success-page">
      <h1>Payment Successful</h1>
      <p>Thank you! Your payment has been received.</p>

      {payment && (
        <div className="payment-details">
          <p>Transaction ID: {payment.transactionId}</p>
          <p>Amount: Rs. {payment.amount}</p>
          <p>Payment Method: {payment.paymentMethod}</p>
        </div>
      )}

      <div className="actions">
        {payment && (
          <button onClick={() => navigate("/invoice", { state: { paymentId: payment._id } })}>
            View Invoice
          </button>
        )}
        <button onClick={() => navigate("/orders")}>Go to My Orders</button>
      </div>
    </div>
  );
}
