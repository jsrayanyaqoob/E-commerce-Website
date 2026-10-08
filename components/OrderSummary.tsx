import { money } from "@/lib/format";

type Totals = { subtotal: number; discount: number; shipping: number; tax: number; total: number };

export default function OrderSummary({ totals, promo }: { totals: Totals; promo?: string }) {
  const rows: [string, string, string?][] = [
    ["Subtotal", money(totals.subtotal)],
    ...(totals.discount > 0 ? ([[`Discount${promo ? ` (${promo})` : ""}`, `-${money(totals.discount)}`, "text-accent"]] as [string, string, string][]) : []),
    ["Shipping", totals.shipping === 0 ? "Free" : money(totals.shipping), totals.shipping === 0 ? "text-accent" : undefined],
    ["Estimated tax", money(totals.tax)],
  ];
  return (
    <dl className="space-y-3 text-sm">
      {rows.map(([k, v, cls]) => (
        <div key={k} className="flex justify-between">
          <dt className="text-muted">{k}</dt>
          <dd className={cls ?? ""}>{v}</dd>
        </div>
      ))}
      <div className="flex items-baseline justify-between border-t border-line pt-4">
        <dt className="font-semibold">Total</dt>
        <dd className="font-display text-3xl font-extrabold">{money(totals.total)}</dd>
      </div>
    </dl>
  );
}
