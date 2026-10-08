"use client";

import { useState } from "react";
import { PROMOS } from "@/lib/pricing";
import { setPromo, toast, useStore } from "@/lib/store";
import { CloseIcon } from "./Icons";

export default function PromoBox({ subtotal }: { subtotal: number }) {
  const promo = useStore((s) => s.promo);
  const [code, setCode] = useState("");

  const apply = () => {
    const c = code.trim().toUpperCase();
    const def = PROMOS[c];
    if (!def) {
      toast("That code isn't valid", "error");
      return;
    }
    if (def.min && subtotal < def.min) {
      toast(`${c} needs a $${def.min} minimum`, "info");
      return;
    }
    setPromo(c);
    setCode("");
    toast(`${c} applied: ${def.label}`);
  };

  if (promo && PROMOS[promo]) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
        <span>
          <b className="text-accent">{promo}</b> · {PROMOS[promo].label}
        </span>
        <button type="button" onClick={() => setPromo("")} className="text-muted hover:text-white" aria-label="Remove promo code">
          <CloseIcon width={16} height={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2" role="group" aria-label="Promo code">
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply();
            }
          }}
          placeholder="Promo code"
          className="field !rounded-full uppercase"
          aria-label="Promo code"
        />
        <button type="button" onClick={apply} className="btn btn-ghost">Apply</button>
      </div>
      <p className="text-xs text-muted">Try WELCOME10, SAVE20 or FREESHIP</p>
    </div>
  );
}
