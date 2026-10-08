"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ProductImage from "./ProductImage";
import Stars from "./Stars";
import { CheckIcon, HeartIcon, LockIcon, MinusIcon, PlusIcon, RefreshIcon, ShieldIcon, TruckIcon } from "./Icons";
import { addToCart, addReview, pushRecent, toast, toggleWishlist, useStore } from "@/lib/store";
import { discountPct } from "@/lib/products";
import { seedReviews } from "@/lib/reviews";
import { dateLong, money } from "@/lib/format";
import type { Product, Review } from "@/lib/types";

const TABS = ["Details", "Specs", "Reviews"] as const;

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const wishlist = useStore((s) => s.wishlist);
  const userReviews = useStore((s) => s.reviews[product.id]);
  const user = useStore((s) => s.user);
  const liked = wishlist.includes(product.id);

  const [colorName, setColorName] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Details");
  const [view, setView] = useState(0);
  const [sizeError, setSizeError] = useState(false);

  const color = product.colors.find((c) => c.name === colorName) ?? product.colors[0];
  const pct = discountPct(product);
  const inStock = product.stock > 0;
  const images = product.images ?? [];

  useEffect(() => {
    pushRecent(product.id);
  }, [product.id]);

  const reviews = useMemo(() => [...(userReviews ?? []), ...seedReviews(product.id)], [userReviews, product.id]);
  const distribution = useMemo(() => {
    const counts = [5, 4, 3, 2, 1].map((s) => reviews.filter((r) => Math.round(r.rating) === s).length);
    return counts.map((c) => (reviews.length ? (c / reviews.length) * 100 : 0));
  }, [reviews]);

  const needSize = Boolean(product.sizes?.length) && !size;

  const add = () => {
    if (needSize) {
      setSizeError(true);
      toast("Please choose a size", "error");
      return false;
    }
    addToCart({ productId: product.id, color: color.name, size, qty });
    return true;
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      {/* GALLERY */}
      <div className="lg:sticky lg:top-40 lg:h-fit">
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-surface2">
          <ProductImage key={view} src={images[view]} alt={`${product.name} - photo ${view + 1}`} sizes="(min-width:1024px) 55vw, 100vw" priority={view === 0} />
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            {pct > 0 && <span className="rounded-full bg-hot px-3 py-1 text-xs font-bold">Save {pct}%</span>}
            {product.badge && <span className="glass rounded-full px-3 py-1 text-xs font-semibold text-accent">{product.badge}</span>}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((src, i) => (
            <button key={src} type="button" onClick={() => setView(i)} aria-label={`Show photo ${i + 1}`} aria-pressed={view === i} className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition ${view === i ? "border-accent" : "border-transparent opacity-70 hover:opacity-100"}`}>
              <ProductImage src={src} alt="" sizes="140px" />
            </button>
          ))}
        </div>
      </div>

      {/* INFO */}
      <div>
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <Link href="/shop" className="hover:text-accent">Shop</Link> /
          <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-accent">{product.category}</Link> /
          <span className="text-ink/70">{product.name}</span>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-[.18em] text-accent">{product.brand}</div>
        <h1 className="font-display mt-2 text-4xl font-bold leading-[1.05] sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg text-muted">{product.tagline}</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Stars rating={product.rating} count={product.reviewCount} size={17} />
          <button type="button" onClick={() => setTab("Reviews")} className="text-xs text-muted underline-offset-4 hover:text-accent hover:underline">Read reviews</button>
        </div>

        <div className="mt-6 flex items-baseline gap-3">
          <span className="font-display text-5xl font-extrabold">{money(product.price)}</span>
          {product.compareAt && <span className="text-xl text-muted line-through">{money(product.compareAt)}</span>}
        </div>
        <p className="mt-1 text-xs text-muted">or 4 interest-free payments of {money(Math.round((product.price / 4) * 100) / 100)}</p>

        {/* Color */}
        <div className="mt-8">
          <div className="mb-3 text-sm"><span className="text-muted">Color:</span> <b>{color.name}</b></div>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Color">
            {product.colors.map((c) => (
              <button key={c.name} type="button" role="radio" aria-checked={c.name === color.name} aria-label={c.name} title={c.name} onClick={() => setColorName(c.name)} className={`grid h-11 w-11 place-items-center rounded-full border-2 transition ${c.name === color.name ? "border-accent" : "border-line hover:border-white/40"}`}>
                <span className="h-7 w-7 rounded-full ring-1 ring-white/20" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        {product.sizes && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span><span className="text-muted">Size:</span> <b>{size ?? "Select"}</b></span>
              <Link href="/help#sizing" className="text-xs text-muted underline-offset-4 hover:text-accent hover:underline">Size guide</Link>
            </div>
            <div className={`flex flex-wrap gap-2 rounded-2xl ${sizeError && !size ? "ring-2 ring-hot/70 ring-offset-4 ring-offset-bg" : ""}`} role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => { setSize(s); setSizeError(false); }} className={`h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold transition ${size === s ? "border-accent bg-accent text-black" : "border-line hover:border-white/40"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Qty + CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center rounded-full border border-line">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10" aria-label="Decrease quantity"><MinusIcon /></button>
            <span className="min-w-8 text-center font-semibold" aria-live="polite">{qty}</span>
            <button type="button" onClick={() => setQty((q) => Math.min(product.stock, Math.min(10, q + 1)))} className="grid h-12 w-12 place-items-center rounded-full hover:bg-white/10" aria-label="Increase quantity"><PlusIcon /></button>
          </div>
          <button type="button" disabled={!inStock} onClick={add} className="btn btn-primary flex-1 !py-4 text-base">
            {inStock ? "Add to cart" : "Sold out"}
          </button>
          <button type="button" onClick={() => toggleWishlist(product.id)} aria-pressed={liked} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} className={`btn btn-ghost !h-[52px] !w-[52px] !p-0 ${liked ? "!text-hot" : ""}`}>
            <HeartIcon filled={liked} />
          </button>
        </div>
        <button type="button" disabled={!inStock} onClick={() => add() && router.push("/checkout")} className="btn btn-dark mt-3 w-full !py-4 text-base">
          Buy it now
        </button>

        <p className={`mt-4 flex items-center gap-2 text-sm ${product.stock <= 12 ? "text-amber-300" : "text-accent"}`}>
          <span className="h-2 w-2 rounded-full bg-current" />
          {product.stock <= 0 ? "Out of stock" : product.stock <= 12 ? `Hurry - only ${product.stock} left` : "In stock, ships within 24 hours"}
        </p>

        <ul className="mt-6 grid gap-3 rounded-3xl border border-line bg-surface p-5 text-sm">
          <li className="flex items-center gap-3"><TruckIcon className="text-accent" /> Free shipping over $75 · Delivery in 2-6 business days</li>
          <li className="flex items-center gap-3"><RefreshIcon className="text-accent" /> 30-day free returns</li>
          <li className="flex items-center gap-3"><ShieldIcon className="text-accent" /> {product.specs.Warranty ?? "1 year"} warranty</li>
          <li className="flex items-center gap-3"><LockIcon className="text-accent" /> Secure, encrypted checkout</li>
        </ul>

        {/* Tabs */}
        <div className="mt-10">
          <div className="flex gap-1 border-b border-line" role="tablist">
            {TABS.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`relative px-4 py-3 text-sm font-semibold transition ${tab === t ? "text-accent" : "text-muted hover:text-white"}`}>
                {t}{t === "Reviews" ? ` (${reviews.length})` : ""}
                {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded bg-accent" />}
              </button>
            ))}
          </div>

          <div className="pt-6" role="tabpanel">
            {tab === "Details" && (
              <div className="space-y-5">
                <p className="leading-relaxed text-ink/85">{product.description}</p>
                <ul className="grid gap-2.5">
                  {product.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/20 text-accent"><CheckIcon width={13} height={13} /></span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "Specs" && (
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
                {Object.entries(product.specs).map(([k, val]) => (
                  <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm odd:bg-white/[.02]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{val}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "Reviews" && (
              <div className="space-y-8">
                <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="text-center">
                    <div className="font-display text-6xl font-extrabold">{product.rating.toFixed(1)}</div>
                    <Stars rating={product.rating} size={18} />
                    <div className="mt-1 text-xs text-muted">{product.reviewCount.toLocaleString()} ratings</div>
                  </div>
                  <div className="space-y-1.5">
                    {distribution.map((w, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <span className="w-6 text-muted">{5 - i}★</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10"><span className="block h-full rounded-full bg-amber-400" style={{ width: `${w}%` }} /></span>
                      </div>
                    ))}
                  </div>
                </div>

                <ReviewForm productId={product.id} defaultName={user?.name} />

                <ul className="space-y-4">
                  {reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl border border-line bg-surface p-5">
                      <div className="flex items-center justify-between gap-3">
                        <Stars rating={r.rating} />
                        <span className="text-xs text-muted">{dateLong(r.date)}</span>
                      </div>
                      <h4 className="mt-2 font-semibold">{r.title}</h4>
                      <p className="mt-1 text-sm text-ink/80">{r.body}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                        {r.author}
                        {r.verified && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-accent">Verified purchase</span>}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted">Reviews marked verified are sample data for the demo store.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({ productId, defaultName }: { productId: string; defaultName?: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState(defaultName ?? "");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost">Write a review</button>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || body.trim().length < 10) {
      toast("Please fill in all fields (review needs 10+ characters)", "error");
      return;
    }
    const review: Review = { id: `r_${Date.now()}`, author: name.trim(), rating, title: title.trim(), body: body.trim(), date: Date.now(), verified: false };
    addReview(productId, review);
    setOpen(false);
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-line bg-surface p-5" noValidate>
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className={`text-3xl leading-none transition hover:scale-110 ${n <= rating ? "text-amber-400" : "text-white/20"}`}>★</button>
        ))}
      </div>
      <input className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name" />
      <input className="field" placeholder="Review title" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Review title" />
      <textarea className="field min-h-28" placeholder="What did you like or dislike?" value={body} onChange={(e) => setBody(e.target.value)} aria-label="Review" />
      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary">Submit review</button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">Cancel</button>
      </div>
    </form>
  );
}
