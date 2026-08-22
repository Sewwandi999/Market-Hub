import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { api } from "../services/api.js";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category) params.set("category", category);

      const data = await api(`/products?${params.toString()}`);
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function submitSearch(event) {
    event.preventDefault();
    loadProducts();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-sm font-bold uppercase tracking-wider text-indigo-600">
            Marketplace
          </div>
          <h1 className="mt-1 text-4xl font-black">Browse Products</h1>
          <p className="mt-2 text-slate-500">Products from MarketHub vendors.</p>
        </div>

        <form onSubmit={submitSearch} className="flex flex-col gap-2 sm:flex-row">
          <input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            <option value="">All categories</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
          </select>
          <button className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">
            Search
          </button>
        </form>
      </div>

      {error && <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      {loading ? (
        <div className="py-16 text-slate-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No products found.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
