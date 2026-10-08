import type { Metadata } from "next";
import { Suspense } from "react";
import ShopBrowser from "@/components/ShopBrowser";
import Countdown from "@/components/Countdown";
import { BoltIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Deals",
  description: "Limited-time markdowns on top tech, footwear and home essentials.",
};

export default function DealsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <header className="relative mb-10 overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-[#2a0f22] via-surface to-[#101018] p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-hot/30 blur-[90px]" />
        <span className="relative inline-flex items-center gap-2 rounded-full bg-hot px-3 py-1 text-xs font-bold uppercase tracking-widest">
          <BoltIcon width={14} height={14} /> Limited time
        </span>
        <h1 className="font-display relative mt-4 text-4xl font-bold sm:text-6xl">Deals worth the hype</h1>
        <p className="relative mt-3 max-w-xl text-muted">Real markdowns on products we love. Prices reset at midnight.</p>
        <div className="relative mt-6"><Countdown /></div>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <ShopBrowser onlyDeals />
      </Suspense>
    </div>
  );
}
