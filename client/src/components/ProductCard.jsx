import { Link } from "react-router";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="h-52 w-full object-cover"
        />
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            {product.category}
          </span>
          <span className="text-xs text-slate-500">{product.stock} in stock</span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="line-clamp-1 text-lg font-bold hover:text-indigo-700"
        >
          {product.productName}
        </Link>

        <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Price</div>
            <div className="text-xl font-black">LKR {product.price.toLocaleString()}</div>
          </div>

          <button
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
