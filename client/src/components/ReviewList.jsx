import StarRating from "./StarRating.jsx";
import { api } from "../services/api.js";

export default function ReviewList({
  reviews,
  currentUser,
  onEdit,
  onDeleted,
}) {
  async function removeReview(reviewId) {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    try {
      await api(`/reviews/${reviewId}`, {
        method: "DELETE",
      });

      await onDeleted?.();
    } catch (error) {
      alert(error.message);
    }
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No reviews yet. Be the first customer to review this product.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const reviewCustomerId =
          typeof review.customerId === "object"
            ? review.customerId?._id
            : review.customerId;

        const isOwner =
          currentUser &&
          String(currentUser.id) === String(reviewCustomerId);

        return (
          <article
            key={review._id}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <StarRating
                  value={review.rating}
                  readOnly
                  size="text-lg"
                />

                <div className="mt-2 font-bold">
                  {review.customerId?.name || "MarketHub Customer"}
                </div>

                <div className="mt-1 text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(review)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => removeReview(review._id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <p className="mt-4 leading-7 text-slate-600">{review.comment}</p>
          </article>
        );
      })}
    </div>
  );
}
