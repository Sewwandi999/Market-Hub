import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

const initial = {
  name: "",
  email: "",
  password: "",
  role: "customer",
  businessName: "",
};

export default function Register() {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const data = await register(form);
      navigate(data.user.role === "vendor" ? "/vendor/products" : "/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-lg px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join as a customer or register a vendor account.
        </p>

        {error && (
          <div className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">Full name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">Account type</span>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </label>

          {form.role === "vendor" && (
            <label className="block">
              <span className="text-sm font-semibold">Business name</span>
              <input
                required
                value={form.businessName}
                onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500"
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-semibold">Password</span>
            <input
              type="password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500"
            />
          </label>

          <button
            disabled={submitting}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white hover:bg-indigo-500 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-indigo-600">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
