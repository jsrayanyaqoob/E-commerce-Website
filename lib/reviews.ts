import type { Review } from "./types";

const SAMPLES = [
  { author: "Alex M.", rating: 5, title: "Exactly what I hoped for", body: "Build quality is excellent and it arrived earlier than promised. Would happily buy again." },
  { author: "Priya S.", rating: 5, title: "Worth every penny", body: "I compared a lot of options and this one is the clear winner. Setup was effortless." },
  { author: "Jordan T.", rating: 4, title: "Great, with one small nitpick", body: "Fantastic overall. I'd love slightly better packaging, but the product itself is top-notch." },
  { author: "Chris L.", rating: 5, title: "Gift they actually loved", body: "Bought this as a gift and it was a huge hit. Looks even better in person." },
  { author: "Sam W.", rating: 4, title: "Solid purchase", body: "Does everything it says. Support answered my question within an hour." },
  { author: "Elena V.", rating: 5, title: "Upgrade I didn't know I needed", body: "Replaced my old one and the difference is night and day. Highly recommend." },
];

/** Deterministic sample reviews so the demo catalog never looks empty. */
export function seedReviews(productId: string): Review[] {
  const n = Number(productId.replace(/\D/g, "")) || 1;
  return Array.from({ length: 4 }, (_, i) => {
    const s = SAMPLES[(n + i * 2) % SAMPLES.length];
    return { id: `${productId}-seed-${i}`, ...s, date: 1_757_000_000_000 - i * 9 * 86_400_000 - n * 3_600_000, verified: true };
  });
}
