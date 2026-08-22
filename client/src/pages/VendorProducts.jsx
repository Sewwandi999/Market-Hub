import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";

const emptyForm = {
  productName: "",
  description: "",
  category: "Electronics",
  price: "",
  stock: "",
  imageUrl: "",
};

export default function VendorProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadMine() {
    try {
      const data = await api("/products/mine");
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  function editProduct(product) {
    setEditingId(product._id);
    setForm({
      productName: product.productName,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveProduct(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await api(`/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setMessage("Product updated successfully.");
      } else {
        await api("/products", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMessage("Product added successfully.");
      }

      setEditingId(null);
      setForm(emptyForm);
      await loadMine();
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeProduct(id) {
    if (!window.confirm("Remove this product?")) return;

    try {
      await api(`/products/${id}`, { method: "DELETE" });
      setMessage("Product removed.");
      await loadMine();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div>
        <div className="text-sm font-bold uppercase tracking-wider text-indigo-600">
          Vendor Dashboard
        </div>
        <h1 className="mt-1 text-4xl font-black">{user.businessName || "Your Store"}</h1>
        <p className="mt-2 text-slate-500">Create, update and manage your products.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <form
          onSubmit={saveProduct}
          className="h-fit rounded-3xl border border-slate-200 bg-white p-6"
        >
          <h2 className="text-xl font-black">
            {editingId ? "Edit Product" : "Add New Product"}
          </h2>

          <div className="mt-5 space-y-3">
            <input
              required
              placeholder="Product name"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <textarea
              required
              rows="4"
              placeholder="Product description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Beauty</option>
              <option>Books</option>
              <option>Other</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                required
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                type="number"
                min="0"
                required
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <input
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {message && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}

          <div className="mt-5 flex gap-2">
            <button className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-xl border border-slate-300 px-4 py-3 font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black">Your Products</h2>
            <span className="text-sm text-slate-500">{products.length} active products</span>
          </div>

          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.productName}
                  className="h-24 w-full rounded-xl object-cover sm:w-28"
                />

                <div className="flex-1">
                  <div className="font-bold">{product.productName}</div>
                  <div className="mt-1 text-sm text-slate-500">
                    {product.category} · Stock {product.stock}
                  </div>
                  <div className="mt-2 font-black">
                    LKR {product.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => editProduct(product)}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {products.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
                No products yet. Add your first product.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
