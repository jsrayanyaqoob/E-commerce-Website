import { StarIcon } from "./Icons";

export default function Stars({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted" aria-label={`${rating} out of 5 stars`}>
      <span className="relative inline-flex">
        <span className="inline-flex text-white/15">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} width={size} height={size} />
          ))}
        </span>
        <span className="absolute inset-0 inline-flex overflow-hidden text-amber-400" style={{ width: `${(rating / 5) * 100}%` }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} width={size} height={size} className="shrink-0" />
          ))}
        </span>
      </span>
      <span className="font-medium text-ink/80">{rating.toFixed(1)}</span>
      {count !== undefined && <span>({count.toLocaleString()})</span>}
    </span>
  );
}
