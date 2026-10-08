import type { Metadata } from "next";
import CheckoutView from "@/components/CheckoutView";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <h1 className="font-display mb-10 text-4xl font-bold sm:text-6xl">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
