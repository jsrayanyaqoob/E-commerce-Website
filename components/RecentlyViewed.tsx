"use client";

import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

export default function RecentlyViewed({ excludeId, title = "Recently viewed" }: { excludeId?: string; title?: string }) {
  const recent = useStore((s) => s.recent);
  const items = recent
    .filter((id) => id !== excludeId)
    .map((id) => getProduct(id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);
  if (items.length === 0) return null;
  return (
    <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6">
      <h2 className="font-display mb-6 text-3xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
