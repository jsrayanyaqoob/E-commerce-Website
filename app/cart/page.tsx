import type { Metadata } from "next";
import CartView from "@/components/CartView";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="font-display mb-10 text-4xl font-bold sm:text-6xl">Your cart</h1>
      <CartView />
    </div>
  );
}
