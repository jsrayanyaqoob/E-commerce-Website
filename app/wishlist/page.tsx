import type { Metadata } from "next";
import WishlistView from "@/components/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="font-display mb-10 text-4xl font-bold sm:text-6xl">Wishlist</h1>
      <WishlistView />
    </div>
  );
}
