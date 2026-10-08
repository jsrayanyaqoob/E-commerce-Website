import type { Metadata } from "next";
import { Suspense } from "react";
import OrderView from "@/components/OrderView";

export const metadata: Metadata = { title: "Order confirmed" };

async function Loader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderView id={id} />;
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <Loader params={params} />
      </Suspense>
    </div>
  );
}
