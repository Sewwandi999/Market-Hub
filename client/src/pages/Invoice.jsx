import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API_BASE = "/api";

export default function Invoice() {
  const location = useLocation();
  const { paymentId } = location.state || {};

  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!paymentId) {
      setError("No payment selected.");
      setLoading(false);
      return;
    }

    async function fetchInvoice() {
      try {
        const res = await fetch(`${API_BASE}/payments/${paymentId}/invoice`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Could not load invoice");
        }
        setInvoice(data.invoice);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [paymentId, token]);

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!invoice) return null;

  return (
    <div className="invoice-page">
      <h1>Invoice</h1>
      <p>Invoice Number: {invoice.invoiceNumber}</p>
      <p>Transaction ID: {invoice.transactionId}</p>
      <p>Date: {new Date(invoice.paidAt).toLocaleString()}</p>
      <p>Payment Method: {invoice.paymentMethod}</p>

      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invoice.order?._id}</td>
            <td>
              {invoice.currency} {invoice.amount}
            </td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => window.print()}>Print / Save as PDF</button>
    </div>
  );
}
