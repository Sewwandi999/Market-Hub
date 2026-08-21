import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine: "",
    city: "",
  });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function placeOrder() {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "customer") {
      setMessage("Please use a customer account to place an order.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          deliveryAddress: address,
        }),
      });

      clearCart();
      navigate("/orders");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-4xl font-black">Your cart is empty</h1>
        <p className="mt-3 text-slate-500">Add products from the marketplace to continue.</p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white"
        >
          Browse Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-4xl font-black">Shopping Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="h-28 w-full rounded-xl object-cover sm:w-32"
              />

              <div className="flex-1">
                <div className="font-bold">{item.productName}</div>
                <div className="mt-1 text-sm text-slate-500">
                  LKR {item.price.toLocaleString()} each
                </div>
              </div>

              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item._id, e.target.value)}
                className="w-24 rounded-xl border border-slate-300 px-3 py-2"
              />

              <div className="min-w-32 font-black">
                LKR {(item.price * item.quantity).toLocaleString()}
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-sm font-bold text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-black">Order Summary</h2>
          <div className="mt-4 flex justify-between border-b border-slate-100 pb-4">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-black">LKR {total.toLocaleString()}</span>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Interim version uses Cash on Delivery. Stripe can be added for the final submission.
          </div>

          <h3 className="mt-6 font-bold">Delivery Details</h3>
          <div className="mt-3 space-y-3">
            {[
              ["fullName", "Full name"],
              ["phone", "Phone number"],
              ["addressLine", "Address"],
              ["city", "City"],
            ].map(([key, label]) => (
              <input
                key={key}
                placeholder={label}
                value={address[key]}
                onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            ))}
          </div>

          {message && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {message}
            </div>
          )}

          <button
            disabled={submitting}
            onClick={placeOrder}
            className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </button>
        </aside>
      </div>
    </section>
  );
}
