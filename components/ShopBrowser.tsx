"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { CloseIcon, FilterIcon, SearchIcon } from "./Icons";
import { brands, categories, products } from "@/lib/products";
import { money } from "@/lib/format";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "popular", label: "Most popular" },
  { value: "rating", label: "Top rated" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
] as const;

const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100;

export default function ShopBrowser({ onlyDeals = false }: { onlyDeals?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const q = sp.get("q") ?? "";
  const category = sp.get("category") ?? "";
  const sort = sp.get("sort") ?? "featured";
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [minRating, setMinRating] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(onlyDeals);
  const [sheet, setSheet] = useState(false);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(sp.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (needle && !`${p.name} ${p.brand} ${p.category} ${p.tagline}`.toLowerCase().includes(needle)) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (inStock && p.stock <= 0) return false;
      if ((onSale || onlyDeals) && !p.compareAt) return false;
      return true;
    });
    list = [...list];
    switch (sort) {
      case "popular": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "rating": list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount); break;
      case "newest": list.sort((a, b) => b.addedAt - a.addedAt); break;
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
    }
    return list;
  }, [q, category, sort, selectedBrands, maxPrice, minRating, inStock, onSale, onlyDeals]);

  const activeCategory = categories.find((c) => c.slug === category);
  const activeFilterCount = selectedBrands.length + (maxPrice < MAX_PRICE ? 1 : 0) + (minRating ? 1 : 0) + (inStock ? 1 : 0) + (onSale && !onlyDeals ? 1 : 0);

  const reset = () => {
    setSelectedBrands([]);
    setMaxPrice(MAX_PRICE);
    setMinRating(0);
    setInStock(false);
    setOnSale(onlyDeals);
  };

  const filters = (
    <div className="space-y-8">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Category</legend>
        <div className="flex flex-col gap-1">
          <button type="button" onClick={() => setParam("category", "")} className={`rounded-xl px-3 py-2 text-left text-sm transition ${!category ? "bg-accent font-semibold text-black" : "hover:bg-white/10"}`}>
            All categories
          </button>
          {categories.map((c) => (
            <button key={c.slug} type="button" onClick={() => setParam("category", c.slug)} className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${category === c.slug ? "bg-accent font-semibold text-black" : "hover:bg-white/10"}`}>
              {c.name}
              <span className="text-xs opacity-60">{products.filter((p) => p.category === c.slug).length}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Max price: {money(maxPrice)}</legend>
        <input type="range" min={50} max={MAX_PRICE} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[#c6ff3d]" aria-label="Maximum price" />
        <div className="mt-1 flex justify-between text-xs text-muted"><span>$50</span><span>{money(MAX_PRICE)}</span></div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Brand</legend>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => {
            const on = selectedBrands.includes(b);
            return (
              <button key={b} type="button" aria-pressed={on} onClick={() => setSelectedBrands((cur) => (on ? cur.filter((x) => x !== b) : [...cur, b]))} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${on ? "border-accent bg-accent/15 text-accent" : "border-line hover:border-white/30"}`}>
                {b}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Rating</legend>
        <div className="flex gap-2">
          {[0, 4, 4.5, 4.8].map((r) => (
            <button key={r} type="button" aria-pressed={minRating === r} onClick={() => setMinRating(r)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${minRating === r ? "border-accent bg-accent/15 text-accent" : "border-line hover:border-white/30"}`}>
              {r === 0 ? "Any" : `${r}★ +`}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3 text-sm">
        <label className="flex cursor-pointer items-center gap-3">
          <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-[#c6ff3d]" /> In stock only
        </label>
        {!onlyDeals && (
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={onSale} onChange={(e) => setOnSale(e.target.checked)} className="h-4 w-4 accent-[#c6ff3d]" /> On sale
          </label>
        )}
      </div>

      {activeFilterCount > 0 && (
        <button type="button" onClick={reset} className="btn btn-ghost w-full">
          Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-40 hidden h-fit max-h-[calc(100vh-11rem)] overflow-y-auto pr-2 lg:block">{filters}</aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="mr-auto text-sm text-muted" aria-live="polite">
            <b className="text-ink">{results.length}</b> product{results.length === 1 ? "" : "s"}
            {q && (
              <>
                {" "}for &ldquo;<span className="text-ink">{q}</span>&rdquo;{" "}
                <button type="button" onClick={() => setParam("q", "")} className="ml-1 text-accent hover:underline">clear</button>
              </>
            )}
            {activeCategory && <> in <span className="text-ink">{activeCategory.name}</span></>}
          </p>
          <button type="button" onClick={() => setSheet(true)} className="btn btn-ghost !py-2 lg:hidden">
            <FilterIcon width={18} height={18} /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
          </button>
          <label className="flex items-center gap-2 text-sm">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)} className="field !w-auto !rounded-full !py-2 pr-8">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value} className="bg-surface">{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-line px-6 py-20 text-center">
            <SearchIcon width={40} height={40} className="text-muted" />
            <h2 className="font-display mt-4 text-2xl font-bold">Nothing matches that</h2>
            <p className="mt-1 text-muted">Try removing a filter or searching for something else.</p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={reset} className="btn btn-primary">Reset filters</button>
              <Link href="/shop" className="btn btn-ghost">All products</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button type="button" className="absolute inset-0 bg-black/70" onClick={() => setSheet(false)} aria-label="Close filters" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] border-t border-line bg-surface p-6" style={{ animation: "sheet-in .3s cubic-bezier(.2,.8,.2,1) both" }}>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Filters</h2>
              <button type="button" onClick={() => setSheet(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Close"><CloseIcon /></button>
            </div>
            {filters}
            <button type="button" onClick={() => setSheet(false)} className="btn btn-primary mt-8 w-full">Show {results.length} results</button>
          </div>
        </div>
      )}
    </div>
  );
}
