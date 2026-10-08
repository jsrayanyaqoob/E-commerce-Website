"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { BagIcon, CloseIcon, ArrowRight } from "./Icons";
import CartLineItem from "./CartLineItem";
import FreeShippingBar from "./FreeShippingBar";
import { setDrawer, useStore } from "@/lib/store";
import { computeTotals } from "@/lib/pricing";
import { money } from "@/lib/format";

export default function CartDrawer() {
  const open = useStore((s) => s.drawerOpen);
  const cart = useStore((s) => s.cart);
  const totals = useMemo(() => computeTotals(cart), [cart]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-label="Close cart" style={{ animation: "fade-in .2s both" }} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-surface shadow-2xl" style={{ animation: "drawer-in .35s cubic-bezier(.2,.8,.2,1) both" }}>
        <div className="flex items-center justify-between border-b border-line p-5">
          <h2 className="font-display text-xl font-bold">Your cart ({totals.itemCount})</h2>
          <button type="button" onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-muted">
              <BagIcon width={36} height={36} />
            </div>
            <p className="font-display text-xl font-bold">Your cart is empty</p>
            <p className="text-sm text-muted">Looks like you haven&apos;t found your next favorite thing yet.</p>
            <Link href="/shop" onClick={() => setDrawer(false)} className="btn btn-primary">
              Start shopping <ArrowRight width={18} height={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <FreeShippingBar subtotal={totals.subtotal} />
              <ul className="space-y-5">
                {cart.map((l) => (
                  <CartLineItem key={l.key} line={l} compact />
                ))}
              </ul>
            </div>
            <div className="space-y-3 border-t border-line bg-bg/60 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-display text-xl font-bold">{money(totals.subtotal)}</span>
              </div>
              <p className="text-xs text-muted">Shipping and taxes calculated at checkout.</p>
              <Link href="/checkout" onClick={() => setDrawer(false)} className="btn btn-primary w-full">
                Checkout <ArrowRight width={18} height={18} />
              </Link>
              <Link href="/cart" onClick={() => setDrawer(false)} className="btn btn-ghost w-full">
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
