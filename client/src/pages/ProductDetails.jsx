import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import StarRating from "../components/StarRating.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import ReviewList from "../components/ReviewList.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
  });
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState("");

  async function loadProduct() {
    const data = await api(`/products/${id}`);
    setProduct(data.product);
  }

  async function loadReviews() {
    const data = await api(`/reviews/product/${id}`);
    setReviews(data.reviews);
    setSummary(data.summary);
  }

  useEffect(() => {
    Promise.all([loadProduct(), loadReviews()]).catch((err) =>
      setError(err.message)
    );
  }, [id]);

  const myReview = useMemo(() => {
    if (!user) return null;

    return reviews.find((review) => {
      const customerId =
        typeof review.customerId === "object"
          ? review.customerId?._id
          : review.customerId;

      return String(customerId) === String(user.id);
    });
  }, [reviews, user]);

  async function refreshReviews() {
    setEditingReview(null);
    await loadReviews();
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-red-700">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        Loading product...
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-2">
        <img
          src={product.imageUrl}
          alt={product.productName}
          className="h-full min-h-96 w-full object-cover"
        />

        <div className="p-8 lg:p-12">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
            {product.category}
          </span>

          <h1 className="mt-5 text-4xl font-black">{product.productName}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating
              value={Math.round(summary.averageRating)}
              readOnly
              size="text-xl"
            />

            <span className="font-bold text-slate-700">
              {summary.averageRating.toFixed(1)} / 5
            </span>

            <span className="text-sm text-slate-500">
              ({summary.totalReviews}{" "}
              {summary.totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>

          <p className="mt-4 leading-7 text-slate-600">
            {product.description}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="text-sm text-slate-500">Sold by</div>
            <div className="font-bold">
              {product.vendorId?.businessName ||
                product.vendorId?.name ||
                "MarketHub Vendor"}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-sm text-slate-500">Price</div>
              <div className="text-3xl font-black">
                LKR {product.price.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                {product.stock} units available
              </div>
            </div>

            <button
              disabled={product.stock <= 0}
              onClick={() => addToCart(product)}
              className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white hover:bg-indigo-500 disabled:bg-slate-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <div>
          <h2 className="text-2xl font-black">Rate This Product</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Share your experience to help other MarketHub customers.
          </p>

          <div className="mt-5">
            {!user ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-600">
                  Please login with a customer account to submit a review.
                </p>
                <Link
                  to="/login"
                  className="mt-4 inline-block rounded-xl bg-indigo-600 px-4 py-2.5 font-bold text-white"
                >
                  Login
                </Link>
              </div>
            ) : user.role !== "customer" ? (
              <div className="rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
                Only customer accounts can submit product reviews.
              </div>
            ) : editingReview ? (
              <ReviewForm
                productId={id}
                existingReview={editingReview}
                onSaved={refreshReviews}
                onCancelEdit={() => setEditingReview(null)}
              />
            ) : myReview ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="font-bold">You already reviewed this product.</div>
                <p className="mt-2 text-sm text-slate-500">
                  You can edit or delete your review from the review list.
                </p>
              </div>
            ) : (
              <ReviewForm
                productId={id}
                onSaved={refreshReviews}
              />
            )}
          </div>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black">Customer Reviews</h2>
              <p className="mt-1 text-sm text-slate-500">
                {summary.totalReviews} customer{" "}
                {summary.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 px-5 py-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Average Rating
              </div>
              <div className="mt-1 text-2xl font-black text-amber-900">
                {summary.averageRating.toFixed(1)} / 5
              </div>
            </div>
          </div>

          <ReviewList
            reviews={reviews}
            currentUser={user}
            onEdit={setEditingReview}
            onDeleted={refreshReviews}
          />
        </div>
      </div>
    </section>
  );
}
