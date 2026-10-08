import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse every NEXORA product. Filter by category, brand, price and rating.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">The catalog</p>
        <h1 className="font-display mt-2 text-4xl font-bold sm:text-6xl">Shop everything</h1>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <ShopBrowser />
      </Suspense>
    </div>
  );
}
