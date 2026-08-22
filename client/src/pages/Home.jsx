import { Link } from "react-router";

const features = [
  ["Multi-Vendor", "Multiple sellers can manage products through one central marketplace."],
  ["Secure Accounts", "JWT-based sessions and password hashing protect user accounts."],
  ["Fast Shopping", "Browse products, add items to cart and place orders quickly."],
  ["Order Tracking", "Customers can view their order history and current delivery status."],
];

export default function Home() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
              MarketHub Marketplace
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Discover more. Shop smarter. Support more sellers.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-indigo-100">
              A centralized Sri Lankan multi-vendor marketplace designed for customers,
              vendors and administrators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-white px-5 py-3 font-bold text-indigo-700 hover:bg-indigo-50"
              >
                Browse Products
              </Link>
              <Link
                to="/register"
                className="rounded-xl border border-white/30 px-5 py-3 font-bold text-white hover:bg-white/10"
              >
                Join MarketHub
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="grid gap-4 sm:grid-cols-2">
              {["Electronics", "Fashion", "Home", "Lifestyle"].map((name, index) => (
                <div
                  key={name}
                  className="rounded-2xl bg-white p-6 text-slate-900 shadow-lg"
                >
                  <div className="text-sm font-semibold text-indigo-600">Category {index + 1}</div>
                  <div className="mt-8 text-2xl font-black">{name}</div>
                  <div className="mt-1 text-sm text-slate-500">Explore vendor products</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="max-w-2xl">
          <div className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Interim build
          </div>
          <h2 className="mt-2 text-3xl font-black">Core e-commerce functions already connected</h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-lg font-bold">{title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
