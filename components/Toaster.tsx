"use client";

import { dismissToast, useStore } from "@/lib/store";
import { CheckIcon, CloseIcon } from "./Icons";

export default function Toaster() {
  const toasts = useStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pl-3 pr-4 text-sm shadow-2xl"
          style={{ animation: "pop .35s cubic-bezier(.2,.8,.2,1) both" }}
          role="status"
        >
          <span className={`grid h-6 w-6 place-items-center rounded-full ${t.tone === "error" ? "bg-hot" : t.tone === "info" ? "bg-violet" : "bg-accent"} text-black`}>
            {t.tone === "error" ? <CloseIcon width={14} height={14} /> : <CheckIcon width={14} height={14} />}
          </span>
          {t.message}
          <button type="button" onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="text-muted hover:text-white">
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
