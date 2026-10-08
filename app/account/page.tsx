import type { Metadata } from "next";
import { Suspense } from "react";
import AccountView from "@/components/AccountView";

export const metadata: Metadata = { title: "My account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-surface" />}>
        <AccountView />
      </Suspense>
    </div>
  );
}
