export default function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "text-2xl",
}) {
  return (
    <div className="flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            className={`${size} ${
              active ? "text-amber-400" : "text-slate-300"
            } ${readOnly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
