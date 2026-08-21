import { useEffect, useState } from "react";
import { api } from "../services/api.js";

const steps = ["placed", "confirmed", "processing", "shipped", "delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/orders/my")
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl font-black">My Orders</h1>
      <p className="mt-2 text-slate-500">Order history and basic delivery tracking.</p>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      <div className="mt-8 space-y-5">
        {orders.length === 0 && !error && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            No orders yet.
          </div>
        )}

        {orders.map((order) => {
          const currentIndex = steps.indexOf(order.status);

          return (
            <article
              key={order._id}
              className="rounded-3xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Order
                  </div>
                  <div className="font-mono text-sm">{order._id}</div>
                  <div className="mt-2 text-sm text-slate-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <div className="text-2xl font-black">
                    LKR {order.totalAmount.toLocaleString()}
                  </div>
                  <span className="mt-2 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold capitalize text-indigo-700">
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-5">
                {steps.map((step, index) => {
                  const active = currentIndex >= index && currentIndex !== -1;
                  return (
                    <div
                      key={step}
                      className={`rounded-xl px-3 py-2 text-center text-xs font-bold capitalize ${
                        active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-4 text-sm">
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      LKR {(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
