"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { categories, products } from "@/lib/products";
import { setDrawer, useStore } from "@/lib/store";
import { money } from "@/lib/format";

const PROMO_MESSAGES = [
  "Free shipping on orders over $75",
  "Use code WELCOME10 for 10% off your first order",
  "30-day hassle-free returns on everything",
  "New: Pulse Watch Ultra just landed",
];

export default function Header() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const user = useStore((s) => s.user);
  const count = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);

  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);
  const boxRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocus(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (count === 0) return;
    const start = setTimeout(() => setBump(true), 0);
    const end = setTimeout(() => setBump(false), 450);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, [count]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setFocus(false);
    setMobileOpen(false);
    router.push(query.trim() ? `/shop?q=${encodeURIComponent(query.trim())}` : "/shop");
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="overflow-hidden border-b border-line bg-black text-xs text-ink/80">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap py-2 pl-16">
          {[...PROMO_MESSAGES, ...PROMO_MESSAGES, ...PROMO_MESSAGES, ...PROMO_MESSAGES].map((m, i) => (
            <span key={i} className="inline-flex items-center gap-16">
              {m}
              <span className="text-accent">&#9679;</span>
            </span>
          ))}
        </div>
      </div>

      <div className={`transition-all duration-300 ${scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,.9)]" : "bg-bg/60 backdrop-blur-md"}`}>
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 md:gap-6">
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <MenuIcon />
          </button>

          <Link href="/" className="font-display flex items-center gap-2 text-2xl font-extrabold" aria-label="NEXORA home">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent text-black">N</span>
            <span className="hidden sm:inline">NEXORA</span>
          </Link>

          <form ref={boxRef} onSubmit={submit} className="relative mx-auto hidden max-w-2xl flex-1 md:block" role="search">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocus(true)}
              placeholder="Search headphones, sneakers, laptops..."
              className="field !rounded-full !bg-white/5 !py-3 !pl-12 !pr-28"
              aria-label="Search products"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !px-5 !py-2 text-sm">
              Search
            </button>
            {focus && suggestions.length > 0 && (
              <div className="glass absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl p-2 shadow-2xl">
                {suggestions.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    onClick={() => {
                      setFocus(false);
                      setQuery("");
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-white/10"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{p.name}</span>
                      <span className="text-xs text-muted">
                        {p.brand} · {p.category}
                      </span>
                    </span>
                    <span className="text-sm font-semibold">{money(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <nav className="ml-auto flex items-center gap-1 md:ml-0" aria-label="Account and cart">
            <Link href="/account" className="flex h-10 items-center gap-2 rounded-full px-3 hover:bg-white/10" aria-label="Account">
              <UserIcon />
              <span className="hidden text-sm xl:inline">{user ? user.name.split(" ")[0] : "Sign in"}</span>
            </Link>
            <Link href="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Wishlist">
              <HeartIcon />
              {wishlist.length > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-hot px-1 text-[10px] font-bold">{wishlist.length}</span>}
            </Link>
            <button
              type="button"
              onClick={() => setDrawer(true)}
              className={`relative grid h-10 w-10 place-items-center rounded-full bg-accent text-black transition-transform ${bump ? "scale-125" : ""}`}
              aria-label={`Open cart, ${count} items`}
            >
              <BagIcon />
              {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-black">{count}</span>}
            </button>
          </nav>
        </div>

        <nav className="hide-scroll mx-auto hidden max-w-[1400px] items-center gap-1 overflow-x-auto px-4 pb-2 text-sm sm:px-6 lg:flex" aria-label="Categories">
          <Link href="/shop" className="rounded-full px-4 py-1.5 font-medium hover:bg-white/10">
            All products
          </Link>
          <Link href="/deals" className="rounded-full px-4 py-1.5 font-semibold text-hot hover:bg-white/10">
            Deals
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="rounded-full px-4 py-1.5 text-ink/80 hover:bg-white/10 hover:text-white">
              {c.name}
            </Link>
          ))}
          <Link href="/help" className="ml-auto rounded-full px-4 py-1.5 text-muted hover:text-white">
            Help
          </Link>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} aria-label="Close menu" style={{ animation: "fade-in .2s both" }} />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col gap-4 overflow-y-auto bg-surface p-5" style={{ animation: "drawer-in .3s cubic-bezier(.2,.8,.2,1) both", transformOrigin: "left" }}>
            <div className="flex items-center justify-between">
              <span className="font-display text-xl font-extrabold">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close menu">
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={submit} className="relative" role="search">
              <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="field !rounded-full !pl-12" aria-label="Search products" />
            </form>
            <div className="grid gap-1" onClick={() => setMobileOpen(false)}>
              <Link href="/shop" className="rounded-xl px-3 py-3 font-medium hover:bg-white/10">All products</Link>
              <Link href="/deals" className="rounded-xl px-3 py-3 font-semibold text-hot hover:bg-white/10">Deals</Link>
              {categories.map((c) => (
                <Link key={c.slug} href={`/shop?category=${c.slug}`} className="rounded-xl px-3 py-3 hover:bg-white/10">
                  {c.name}
                </Link>
              ))}
              <Link href="/account" className="rounded-xl px-3 py-3 hover:bg-white/10">My account</Link>
              <Link href="/help" className="rounded-xl px-3 py-3 hover:bg-white/10">Help center</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
