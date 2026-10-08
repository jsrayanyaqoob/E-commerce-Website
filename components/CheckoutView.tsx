"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import OrderSummary from "./OrderSummary";
import PromoBox from "./PromoBox";
import ProductImage from "./ProductImage";
import { ArrowRight, BagIcon, LockIcon } from "./Icons";
import { placeOrder, toast, useStore } from "@/lib/store";
import { computeTotals, SHIPPING_OPTIONS } from "@/lib/pricing";
import { getProduct } from "@/lib/products";
import { money } from "@/lib/format";
import type { Address, Order, OrderLine, ShippingMethod } from "@/lib/types";

type Errors = Record<string, string>;

const luhn = (num: string) => {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return num.length >= 13 && sum % 10 === 0;
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ink/80">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-hot" role="alert">{error}</span>}
    </label>
  );
}

export default function CheckoutView() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const promo = useStore((s) => s.promo);
  const user = useStore((s) => s.user);
  const ready = useStore((s) => s.ready);

  const [form, setForm] = useState<Address>({
    name: "", email: "", phone: "", line1: "", city: "", state: "", zip: "", country: "United States",
  });
  const [touched, setTouched] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [method, setMethod] = useState<ShippingMethod>("standard");
  const [payment, setPayment] = useState<"card" | "cod">("card");
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);

  // Prefill from the signed-in profile once it is available (derived during render, no effect needed).
  if (ready && user && !prefilled) {
    setPrefilled(true);
    setForm((f) => ({ ...f, name: user.name, email: user.email, phone: user.phone ?? "", ...(user.address as Partial<Address>) }));
  }

  const totals = useMemo(() => computeTotals(cart, promo, method), [cart, promo, method]);

  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (cart.length === 0 && busy) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;

  if (cart.length === 0) {
    return (
      <div className="grid place-items-center rounded-[2rem] border border-dashed border-line px-6 py-24 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-white/5 text-muted"><BagIcon width={36} height={36} /></span>
        <h2 className="font-display mt-6 text-3xl font-bold">Nothing to check out</h2>
        <p className="mt-2 text-muted">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-8">Find something you love <ArrowRight width={18} height={18} /></Link>
      </div>
    );
  }

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = (): Errors => {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number";
    if (form.line1.trim().length < 4) e.line1 = "Enter your street address";
    if (form.city.trim().length < 2) e.city = "Enter your city";
    if (form.state.trim().length < 2) e.state = "Enter your state";
    if (form.zip.trim().length < 3) e.zip = "Enter your ZIP / postal code";
    if (payment === "card") {
      const digits = card.number.replace(/\s/g, "");
      if (!luhn(digits)) e.number = "Enter a valid card number";
      if (card.name.trim().length < 2) e.cardName = "Enter the name on the card";
      const m = card.exp.match(/^(\d{2})\/(\d{2})$/);
      const now = new Date();
      if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) e.exp = "Use MM/YY";
      else if (2000 + Number(m[2]) < now.getFullYear() || (2000 + Number(m[2]) === now.getFullYear() && Number(m[1]) < now.getMonth() + 1)) e.exp = "Card has expired";
      if (!/^\d{3,4}$/.test(card.cvc)) e.cvc = "3 or 4 digits";
    }
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      toast("Please fix the highlighted fields", "error");
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1400));

    const lines: OrderLine[] = cart.flatMap((l) => {
      const p = getProduct(l.productId);
      return p ? [{ productId: p.id, name: p.name, brand: p.brand, shape: p.shape, hues: p.hues, price: p.price, qty: l.qty, color: l.color, size: l.size }] : [];
    });
    const order: Order = {
      id: `NX-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36 ** 2).toString(36).toUpperCase().padStart(2, "0")}`,
      createdAt: Date.now(),
      lines,
      ...totals,
      promo: promo || undefined,
      shippingMethod: method,
      payment,
      last4: payment === "card" ? card.number.replace(/\s/g, "").slice(-4) : undefined,
      address: form,
    };
    placeOrder(order);
    router.push(`/order/${order.id}`);
  };

  const err = (k: string) => (touched ? errors[k] : undefined);
  const inv = (k: string) => (touched && errors[k] ? true : undefined);

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        {!user && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4 text-sm">
            <span>Have an account? Sign in for faster checkout.</span>
            <Link href="/account" className="font-semibold text-accent hover:underline">Sign in</Link>
          </div>
        )}

        <section className="rounded-3xl border border-line bg-surface p-6" aria-labelledby="ship-h">
          <h2 id="ship-h" className="font-display mb-5 flex items-center gap-3 text-2xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-black">1</span> Shipping address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={err("name")}><input className="field" value={form.name} onChange={set("name")} aria-invalid={inv("name")} autoComplete="name" /></Field>
            <Field label="Email" error={err("email")}><input className="field" type="email" value={form.email} onChange={set("email")} aria-invalid={inv("email")} autoComplete="email" /></Field>
            <Field label="Phone" error={err("phone")}><input className="field" type="tel" value={form.phone} onChange={set("phone")} aria-invalid={inv("phone")} autoComplete="tel" /></Field>
            <Field label="Country">
              <select className="field" value={form.country} onChange={set("country")} autoComplete="country-name">
                {["United States", "Canada", "United Kingdom", "Australia", "Germany", "Pakistan", "United Arab Emirates"].map((c) => <option key={c} className="bg-surface">{c}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2"><Field label="Street address" error={err("line1")}><input className="field" value={form.line1} onChange={set("line1")} aria-invalid={inv("line1")} autoComplete="address-line1" /></Field></div>
            <Field label="City" error={err("city")}><input className="field" value={form.city} onChange={set("city")} aria-invalid={inv("city")} autoComplete="address-level2" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State / Province" error={err("state")}><input className="field" value={form.state} onChange={set("state")} aria-invalid={inv("state")} autoComplete="address-level1" /></Field>
              <Field label="ZIP" error={err("zip")}><input className="field" value={form.zip} onChange={set("zip")} aria-invalid={inv("zip")} autoComplete="postal-code" /></Field>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6" aria-labelledby="del-h">
          <h2 id="del-h" className="font-display mb-5 flex items-center gap-3 text-2xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-black">2</span> Delivery</h2>
          <div className="grid gap-3" role="radiogroup" aria-label="Delivery method">
            {(Object.keys(SHIPPING_OPTIONS) as ShippingMethod[]).map((k) => {
              const o = SHIPPING_OPTIONS[k];
              const free = k === "standard" && computeTotals(cart, promo, k).shipping === 0;
              return (
                <label key={k} className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition ${method === k ? "border-accent bg-accent/10" : "border-line hover:border-white/30"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="delivery" checked={method === k} onChange={() => setMethod(k)} className="h-4 w-4 accent-[#c6ff3d]" />
                    <span><b>{o.label}</b><span className="block text-xs text-muted">{o.eta}</span></span>
                  </span>
                  <span className="font-semibold">{free ? <span className="text-accent">Free</span> : money(o.price)}</span>
                </label>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-surface p-6" aria-labelledby="pay-h">
          <h2 id="pay-h" className="font-display mb-5 flex items-center gap-3 text-2xl font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-black">3</span> Payment</h2>
          <div className="mb-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {([["card", "Credit / debit card"], ["cod", "Cash on delivery"]] as const).map(([k, label]) => (
              <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${payment === k ? "border-accent bg-accent/10" : "border-line hover:border-white/30"}`}>
                <input type="radio" name="payment" checked={payment === k} onChange={() => setPayment(k)} className="h-4 w-4 accent-[#c6ff3d]" /> {label}
              </label>
            ))}
          </div>

          {payment === "card" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Card number" error={err("number")}>
                  <input className="field font-mono" inputMode="numeric" placeholder="4242 4242 4242 4242" maxLength={19} value={card.number} aria-invalid={inv("number")} autoComplete="cc-number"
                    onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }))} />
                </Field>
              </div>
              <div className="sm:col-span-2"><Field label="Name on card" error={err("cardName")}><input className="field" value={card.name} onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))} aria-invalid={inv("cardName")} autoComplete="cc-name" /></Field></div>
              <Field label="Expiry" error={err("exp")}>
                <input className="field font-mono" inputMode="numeric" placeholder="MM/YY" maxLength={5} value={card.exp} aria-invalid={inv("exp")} autoComplete="cc-exp"
                  onChange={(e) => {
                    const d = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setCard((c) => ({ ...c, exp: d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d }));
                  }} />
              </Field>
              <Field label="CVC" error={err("cvc")}>
                <input className="field font-mono" inputMode="numeric" placeholder="123" maxLength={4} value={card.cvc} aria-invalid={inv("cvc")} autoComplete="cc-csc"
                  onChange={(e) => setCard((c) => ({ ...c, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))} />
              </Field>
              <p className="flex items-center gap-2 text-xs text-muted sm:col-span-2">
                <LockIcon width={14} height={14} /> Demo checkout: no payment is processed and card details never leave your browser (only the last 4 digits are kept on the order). Test card: 4242 4242 4242 4242, any future date, any CVC.
              </p>
            </div>
          ) : (
            <p className="rounded-2xl bg-white/[.03] p-4 text-sm text-muted">Pay with cash when your order arrives. A small cash-handling fee may apply on delivery.</p>
          )}
        </section>
      </div>

      <aside className="h-fit space-y-5 rounded-3xl border border-line bg-surface p-6 lg:sticky lg:top-40">
        <h2 className="font-display text-2xl font-bold">Your order</h2>
        <ul className="max-h-72 space-y-4 overflow-y-auto pr-1">
          {cart.map((l) => {
            const p = getProduct(l.productId);
            if (!p) return null;
            return (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <ProductImage src={p.images?.[0]} alt={p.name} sizes="64px" />
                  <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-accent px-1 text-[11px] font-bold text-black">{l.qty}</span>
                </span>
                <span className="min-w-0 flex-1 text-sm"><span className="line-clamp-1 font-medium">{p.name}</span><span className="text-xs text-muted">{l.color}{l.size ? ` · ${l.size}` : ""}</span></span>
                <span className="text-sm font-semibold">{money(p.price * l.qty)}</span>
              </li>
            );
          })}
        </ul>
        <PromoBox subtotal={totals.subtotal} />
        <OrderSummary totals={totals} promo={promo} />
        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-4 text-base">
          {busy ? (<><span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Processing...</>) : (<><LockIcon width={18} height={18} /> Place order · {money(totals.total)}</>)}
        </button>
        <p className="text-center text-xs text-muted">By placing your order you agree to our terms and return policy.</p>
      </aside>
    </form>
  );
}
