import { getProduct } from "./products";
import type { CartLine, ShippingMethod } from "./types";

export const FREE_SHIPPING_THRESHOLD = 75;
export const TAX_RATE = 0.08;

export const SHIPPING_OPTIONS: Record<ShippingMethod, { label: string; eta: string; price: number }> = {
  standard: { label: "Standard", eta: "4-6 business days", price: 6.99 },
  express: { label: "Express", eta: "2 business days", price: 14.99 },
  overnight: { label: "Overnight", eta: "Next business day", price: 24.99 },
};

export const PROMOS: Record<string, { label: string; apply: (subtotal: number) => number; freeShipping?: boolean; min?: number }> = {
  WELCOME10: { label: "10% off your order", apply: (s) => s * 0.1 },
  SAVE20: { label: "$20 off orders over $150", apply: (s) => (s >= 150 ? 20 : 0), min: 150 },
  FREESHIP: { label: "Free shipping", apply: () => 0, freeShipping: true },
};

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function lineUnitPrice(productId: string) {
  return getProduct(productId)?.price ?? 0;
}

export function computeTotals(lines: CartLine[], promo?: string, method: ShippingMethod = "standard") {
  const subtotal = round2(lines.reduce((sum, l) => sum + lineUnitPrice(l.productId) * l.qty, 0));
  const promoDef = promo ? PROMOS[promo.toUpperCase()] : undefined;
  const discount = promoDef ? round2(Math.min(subtotal, promoDef.apply(subtotal))) : 0;
  const base = SHIPPING_OPTIONS[method].price;
  const qualifiesFree = method === "standard" && subtotal - discount >= FREE_SHIPPING_THRESHOLD;
  const shipping = lines.length === 0 ? 0 : promoDef?.freeShipping || qualifiesFree ? 0 : base;
  const tax = round2((subtotal - discount) * TAX_RATE);
  const total = round2(subtotal - discount + shipping + tax);
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  return { subtotal, discount, shipping, tax, total, itemCount };
}
