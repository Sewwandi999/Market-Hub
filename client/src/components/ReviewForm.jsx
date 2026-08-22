import { useEffect, useState } from "react";
import StarRating from "./StarRating.jsx";
import { api } from "../services/api.js";

export default function ReviewForm({
  productId,
  existingReview = null,
  onSaved,
  onCancelEdit,
}) {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setRating(existingReview?.rating || 5);
    setComment(existingReview?.comment || "");
  }, [existingReview]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      if (existingReview) {
        await api(`/reviews/${existingReview._id}`, {
          method: "PUT",
          body: JSON.stringify({ rating, comment }),
        });
        setMessage("Your review was updated.");
      } else {
        await api("/reviews", {
          method: "POST",
          body: JSON.stringify({ productId, rating, comment }),
        });
        setMessage("Your review was submitted.");
        setRating(5);
        setComment("");
      }

      await onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
    >
      <h3 className="text-lg font-black">
        {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold text-slate-600">Your rating</div>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <label className="mt-4 block">
        <span className="text-sm font-semibold text-slate-600">Your review</span>
        <textarea
          required
          minLength={2}
          maxLength={500}
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell other customers about this product..."
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500"
        />
      </label>

      {error && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          disabled={submitting}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white hover:bg-indigo-500 disabled:opacity-60"
        >
          {submitting
            ? "Saving..."
            : existingReview
              ? "Update Review"
              : "Submit Review"}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-bold text-slate-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
