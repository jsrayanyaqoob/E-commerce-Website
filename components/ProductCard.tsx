"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import Stars from "./Stars";
import { HeartIcon, BagIcon } from "./Icons";
import { addToCart, toggleWishlist, useStore } from "@/lib/store";
import { discountPct } from "@/lib/products";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const wishlist = useStore((s) => s.wishlist);
  const liked = wishlist.includes(product.id);
  const pct = discountPct(product);
  const hasOptions = Boolean(product.sizes?.length);

  return (
    <article className="card-hover group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden" aria-label={product.name} prefetch={priority}>
        <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-110">
          <ProductImage src={product.images?.[0]} alt={product.name} sizes="(min-width:1280px) 25vw, (min-width:640px) 33vw, 50vw" priority={priority} />
        </div>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {pct > 0 && <span className="rounded-full bg-hot px-2.5 py-1 text-[11px] font-bold text-white">-{pct}%</span>}
          {product.badge && <span className="glass rounded-full px-2.5 py-1 text-[11px] font-semibold text-accent">{product.badge}</span>}
        </div>
        {product.stock <= 12 && (
          <span className="glass absolute bottom-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-medium text-amber-300">Only {product.stock} left</span>
        )}
      </Link>

      <button
        type="button"
        onClick={() => toggleWishlist(product.id)}
        aria-pressed={liked}
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        className={`glass absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full transition hover:scale-110 ${liked ? "text-hot" : "text-white"}`}
      >
        <HeartIcon filled={liked} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-muted">{product.brand}</div>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 min-h-[2.6rem] text-[15px] font-semibold leading-snug hover:text-accent">
          {product.name}
        </Link>
        <Stars rating={product.rating} count={product.reviewCount} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold">{money(product.price)}</span>
            {product.compareAt && <span className="text-sm text-muted line-through">{money(product.compareAt)}</span>}
          </div>
          {hasOptions ? (
            <Link href={`/product/${product.slug}`} className="btn btn-ghost !px-4 !py-2 text-xs">
              Options
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => addToCart({ productId: product.id, color: product.colors[0].name })}
              className="btn btn-primary !px-4 !py-2 text-xs"
              aria-label={`Add ${product.name} to cart`}
            >
              <BagIcon width={16} height={16} /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
