import { Star } from "lucide-react";

interface Props {
  rating: number;
  count?: number;
  size?: number;
}

export default function StarRating({ rating, count, size = 14 }: Props) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= Math.round(rating)
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}