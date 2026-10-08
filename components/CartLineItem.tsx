"use client";

import Link from "next/link";
import ProductImage from "./ProductImage";
import { MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import { removeLine, setQty } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { money } from "@/lib/format";
import type { CartLine } from "@/lib/types";

export default function CartLineItem({ line, compact = false }: { line: CartLine; compact?: boolean }) {
  const product = getProduct(line.productId);
  if (!product) return null;
  const size = compact ? "h-20 w-20" : "h-28 w-28 sm:h-32 sm:w-32";

  return (
    <li className="flex gap-4">
      <Link href={`/product/${product.slug}`} className={`${size} relative shrink-0 overflow-hidden rounded-2xl`}>
        <ProductImage src={product.images?.[0]} alt={product.name} sizes="128px" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[.14em] text-muted">{product.brand}</div>
            <Link href={`/product/${product.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-accent">
              {product.name}
            </Link>
            <div className="mt-0.5 text-xs text-muted">
              {line.color}
              {line.size ? ` · Size ${line.size}` : ""}
            </div>
          </div>
          <div className="text-right font-display font-bold">{money(product.price * line.qty)}</div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="inline-flex items-center rounded-full border border-line">
            <button type="button" onClick={() => setQty(line.key, line.qty - 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Decrease quantity">
              <MinusIcon width={14} height={14} />
            </button>
            <span className="min-w-7 text-center text-sm font-semibold" aria-live="polite">
              {line.qty}
            </span>
            <button type="button" onClick={() => setQty(line.key, line.qty + 1)} disabled={line.qty >= product.stock} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30" aria-label="Increase quantity">
              <PlusIcon width={14} height={14} />
            </button>
          </div>
          <button type="button" onClick={() => removeLine(line.key)} className="flex items-center gap-1.5 text-xs text-muted hover:text-hot" aria-label={`Remove ${product.name}`}>
            <TrashIcon width={15} height={15} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
