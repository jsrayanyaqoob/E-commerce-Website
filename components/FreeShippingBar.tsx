import { FREE_SHIPPING_THRESHOLD } from "@/lib/pricing";
import { money } from "@/lib/format";
import { TruckIcon } from "./Icons";

export default function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div className="rounded-2xl border border-line bg-white/[.03] p-3.5">
      <div className="mb-2 flex items-center gap-2 text-sm">
        <TruckIcon width={18} height={18} className="text-accent" />
        {remaining > 0 ? (
          <span>
            Add <b className="text-accent">{money(remaining)}</b> more for free shipping
          </span>
        ) : (
          <span className="font-medium text-accent">You&apos;ve unlocked free standard shipping!</span>
        )}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-accent to-violet transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
