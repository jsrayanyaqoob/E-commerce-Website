"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductImage from "./ProductImage";
import OrderSummary from "./OrderSummary";
import { ArrowRight, CheckIcon, PackageIcon } from "./Icons";
import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { SHIPPING_OPTIONS } from "@/lib/pricing";
import { addBusinessDays, dateLong, money, shortDate } from "@/lib/format";
import type { Order } from "@/lib/types";

/** Demo tracking: the order advances through stages on a compressed timeline. */
const STAGES = [
  { label: "Order confirmed", after: 0 },
  { label: "Packed", after: 60_000 },
  { label: "Shipped", after: 180_000 },
  { label: "Out for delivery", after: 360_000 },
  { label: "Delivered", after: 600_000 },
];

export function OrderTracker({ order }: { order: Order }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);
  const elapsed = now === null ? 0 : now - order.createdAt;
  const current = STAGES.reduce((acc, s, i) => (elapsed >= s.after ? i : acc), 0);

  return (
    <ol className="grid gap-6 sm:grid-cols-5 sm:gap-0" aria-label="Order progress">
      {STAGES.map((s, i) => {
        const done = i <= current;
        const last = i === STAGES.length - 1;
        return (
          <li key={s.label} className="relative flex items-center gap-4 sm:flex-col sm:gap-3 sm:text-center">
            {!last && (
              <span
                aria-hidden
                className={`absolute left-[18px] top-[18px] -z-0 h-[calc(100%+1.5rem)] w-0.5 -translate-x-1/2 sm:left-1/2 sm:h-0.5 sm:w-full sm:translate-x-0 ${i < current ? "bg-accent" : "bg-white/10"}`}
              />
            )}
            <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition ${done ? "border-accent bg-accent text-black" : "border-white/15 bg-surface text-muted"}`}>
              {done ? <CheckIcon width={16} height={16} /> : i + 1}
            </span>
            <span className={`text-sm ${done ? "font-semibold text-ink" : "text-muted"}`}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="space-y-4">
      {order.lines.map((l, i) => (
        <li key={i} className="flex items-center gap-4">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
            <ProductImage src={getProduct(l.productId)?.images?.[0]} alt={l.name} sizes="64px" />
          </span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="line-clamp-1 font-medium">{l.name}</span>
            <span className="text-xs text-muted">{l.brand} · Qty {l.qty}{l.color ? ` · ${l.color}` : ""}{l.size ? ` · ${l.size}` : ""}</span>
          </span>
          <span className="text-sm font-semibold">{money(l.price * l.qty)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function OrderView({ id }: { id: string }) {
  const orders = useStore((s) => s.orders);
  const ready = useStore((s) => s.ready);
  const order = orders.find((o) => o.id === id);

  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (!order) {
    return (
      <div className="grid place-items-center rounded-[2rem] border border-dashed border-line px-6 py-24 text-center">
        <PackageIcon width={44} height={44} className="text-muted" />
        <h2 className="font-display mt-4 text-3xl font-bold">Order not found</h2>
        <p className="mt-2 text-muted">We couldn&apos;t find order {id} in this browser.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Keep shopping</Link>
      </div>
    );
  }

  const ship = SHIPPING_OPTIONS[order.shippingMethod];
  const days = order.shippingMethod === "standard" ? 6 : order.shippingMethod === "express" ? 2 : 1;
  const eta = shortDate(addBusinessDays(order.createdAt, days));

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/15 via-surface to-violet/10 p-8 text-center sm:p-12">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent text-black" style={{ animation: "pop .5s both" }}>
          <CheckIcon width={32} height={32} />
        </span>
        <h1 className="font-display mt-5 text-4xl font-bold sm:text-6xl">Thank you, {order.address.name.split(" ")[0]}!</h1>
        <p className="mt-3 text-muted">
          Order <b className="font-mono text-ink">{order.id}</b> is confirmed for <b className="text-ink">{order.address.email}</b>. (Demo store: no email is actually sent.)
        </p>
        <p className="mt-1 text-sm text-accent">Estimated delivery: {eta}</p>
      </div>

      <section className="rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display mb-6 text-2xl font-bold">Tracking</h2>
        <OrderTracker order={order} />
        <p className="mt-6 text-xs text-muted">Demo tracking advances on a compressed timeline so you can see every stage.</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="font-display mb-5 text-2xl font-bold">Items</h2>
          <OrderLines order={order} />
        </section>
        <div className="space-y-6">
          <section className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-display mb-4 text-xl font-bold">Summary</h2>
            <OrderSummary totals={order} promo={order.promo} />
          </section>
          <section className="space-y-4 rounded-3xl border border-line bg-surface p-6 text-sm">
            <div><div className="text-xs uppercase tracking-widest text-muted">Ship to</div><address className="mt-1 not-italic">{order.address.name}<br />{order.address.line1}<br />{order.address.city}, {order.address.state} {order.address.zip}<br />{order.address.country}</address></div>
            <div><div className="text-xs uppercase tracking-widest text-muted">Delivery</div><div className="mt-1">{ship.label} · {ship.eta}</div></div>
            <div><div className="text-xs uppercase tracking-widest text-muted">Payment</div><div className="mt-1">{order.payment === "card" ? `Card ending ${order.last4}` : "Cash on delivery"}</div></div>
            <div><div className="text-xs uppercase tracking-widest text-muted">Placed</div><div className="mt-1">{dateLong(order.createdAt)}</div></div>
          </section>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-primary">Continue shopping <ArrowRight width={18} height={18} /></Link>
        <Link href="/account?tab=orders" className="btn btn-ghost">View all orders</Link>
      </div>
    </div>
  );
}
