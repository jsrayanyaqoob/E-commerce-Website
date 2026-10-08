"use client";

import Link from "next/link";
import { useState } from "react";
import { categories } from "@/lib/products";
import { toast } from "@/lib/store";
import { ArrowRight } from "./Icons";

export default function Footer() {
  const [email, setEmail] = useState("");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast("Please enter a valid email address", "error");
      return;
    }
    toast("You're on the list! Check your inbox for 10% off.");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-line bg-black">
      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-md">
            <div className="font-display flex items-center gap-2 text-3xl font-extrabold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-black">N</span>
              NEXORA
            </div>
            <p className="mt-4 text-muted">Premium tech, fashion and home essentials, curated and delivered fast. Join 2M+ happy customers.</p>
            <form onSubmit={subscribe} className="mt-6 flex gap-2" noValidate>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email for 10% off" className="field !rounded-full" aria-label="Email address" />
              <button type="submit" className="btn btn-primary" aria-label="Subscribe">
                <ArrowRight width={18} height={18} />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">Shop</h3>
              <ul className="space-y-2.5 text-sm">
                {categories.slice(0, 6).map((c) => (
                  <li key={c.slug}>
                    <Link href={`/shop?category=${c.slug}`} className="hover:text-accent">{c.name}</Link>
                  </li>
                ))}
                <li><Link href="/deals" className="text-hot hover:underline">Deals</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">Support</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/help#shipping" className="hover:text-accent">Shipping</Link></li>
                <li><Link href="/help#returns" className="hover:text-accent">Returns</Link></li>
                <li><Link href="/help#payments" className="hover:text-accent">Payments</Link></li>
                <li><Link href="/help#contact" className="hover:text-accent">Contact us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted">Account</h3>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/account" className="hover:text-accent">My account</Link></li>
                <li><Link href="/account?tab=orders" className="hover:text-accent">Orders</Link></li>
                <li><Link href="/wishlist" className="hover:text-accent">Wishlist</Link></li>
                <li><Link href="/cart" className="hover:text-accent">Cart</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>&copy; NEXORA. Demo store - no real purchases are made.</p>
          <div className="flex flex-wrap gap-2">
            {["VISA", "Mastercard", "AMEX", "Apple Pay", "COD"].map((p) => (
              <span key={p} className="rounded-md border border-line px-2.5 py-1 font-semibold text-ink/70">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
