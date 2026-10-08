"use client";

import Link from "next/link";
import { useMemo } from "react";
import CartLineItem from "./CartLineItem";
import FreeShippingBar from "./FreeShippingBar";
import OrderSummary from "./OrderSummary";
import PromoBox from "./PromoBox";
import ProductCard from "./ProductCard";
import { ArrowRight, BagIcon, LockIcon } from "./Icons";
import { clearCart, useStore } from "@/lib/store";
import { computeTotals } from "@/lib/pricing";
import { products } from "@/lib/products";

export default function CartView() {
  const cart = useStore((s) => s.cart);
  const promo = useStore((s) => s.promo);
  const ready = useStore((s) => s.ready);
  const totals = useMemo(() => computeTotals(cart, promo), [cart, promo]);
  const suggestions = useMemo(() => {
    const inCart = new Set(cart.map((l) => l.productId));
    return products.filter((p) => !inCart.has(p.id)).sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [cart]);

  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (cart.length === 0) {
    return (
      <div className="grid place-items-center rounded-[2rem] border border-dashed border-line px-6 py-24 text-center">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-white/5 text-muted"><BagIcon width={44} height={44} /></span>
        <h2 className="font-display mt-6 text-3xl font-bold">Your cart is empty</h2>
        <p className="mt-2 max-w-sm text-muted">Add a few things you love and they&apos;ll show up here.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Browse products <ArrowRight width={18} height={18} /></Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section aria-label="Cart items" className="space-y-6">
          <FreeShippingBar subtotal={totals.subtotal} />
          <ul className="divide-y divide-line rounded-3xl border border-line bg-surface p-5 [&>li]:py-5 first:[&>li]:pt-0 last:[&>li]:pb-0">
            {cart.map((l) => (
              <CartLineItem key={l.key} line={l} />
            ))}
          </ul>
          <div className="flex justify-between">
            <Link href="/shop" className="text-sm text-muted hover:text-accent">&larr; Continue shopping</Link>
            <button type="button" onClick={clearCart} className="text-sm text-muted hover:text-hot">Clear cart</button>
          </div>
        </section>

        <aside className="h-fit space-y-5 rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-40">
          <h2 className="font-display text-2xl font-bold">Order summary</h2>
          <PromoBox subtotal={totals.subtotal} />
          <OrderSummary totals={totals} promo={promo} />
          <Link href="/checkout" className="btn btn-primary w-full !py-4 text-base">
            <LockIcon width={18} height={18} /> Secure checkout
          </Link>
          <p className="text-center text-xs text-muted">Taxes estimated at 8%. Shipping options chosen at checkout.</p>
        </aside>
      </div>

      <section className="mt-20">
        <h2 className="font-display mb-6 text-3xl font-bold">Complete your setup</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
