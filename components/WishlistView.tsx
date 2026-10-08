"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
import { ArrowRight, HeartIcon } from "./Icons";
import { addToCart, toast, useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function WishlistView() {
  const wishlist = useStore((s) => s.wishlist);
  const ready = useStore((s) => s.ready);
  const items = wishlist.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (items.length === 0) {
    return (
      <div className="grid place-items-center rounded-[2rem] border border-dashed border-line px-6 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-muted"><HeartIcon width={36} height={36} /></span>
        <h2 className="font-display mt-6 text-3xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-muted">Tap the heart on anything you love to save it for later.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Discover products <ArrowRight width={18} height={18} /></Link>
      </div>
    );
  }

  const addAll = () => {
    const simple = items.filter((p) => !p.sizes);
    simple.forEach((p) => addToCart({ productId: p.id, color: p.colors[0].name }, false));
    toast(simple.length ? `${simple.length} item${simple.length > 1 ? "s" : ""} added to cart` : "Pick a size on those products first", simple.length ? "success" : "info");
  };

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button type="button" onClick={addAll} className="btn btn-ghost">Add all to cart</button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
