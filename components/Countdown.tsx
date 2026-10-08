"use client";

import { useEffect, useState } from "react";

/** Counts down to the next local midnight, so the "daily deal" always looks live. */
export default function Countdown() {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setLeft(end.getTime() - now.getTime());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parts = (() => {
    if (left === null) return ["--", "--", "--"];
    const s = Math.floor(left / 1000);
    return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, "0"));
  })();

  return (
    <div className="flex items-center gap-2" role="timer" aria-label="Time left on today's deals">
      {parts.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface2 font-mono text-xl font-bold tabular-nums">{p}</div>
          {i < 2 && <span className="text-muted">:</span>}
        </div>
      ))}
    </div>
  );
}
