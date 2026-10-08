"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ProductCard from "./ProductCard";
import { OrderLines } from "./OrderView";
import { ArrowRight, PackageIcon } from "./Icons";
import { addToCart, login, logout, register, toast, updateProfile, useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { dateLong, money } from "@/lib/format";
import type { Product } from "@/lib/types";

type Tab = "overview" | "orders" | "wishlist" | "profile";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
  { id: "wishlist", label: "Wishlist" },
  { id: "profile", label: "Profile" },
];

function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "register" && name.trim().length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    setBusy(true);
    const res = mode === "login" ? await login(email, password) : await register(name, email, password);
    setBusy(false);
    if (!res.ok) setError(res.error);
  };

  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet via-[#3a1f9c] to-[#0b0b12] p-10 lg:block">
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent/40 blur-[90px]" />
        <h2 className="font-display relative text-5xl font-extrabold leading-none">Your gear.<br />Your orders.<br />One place.</h2>
        <ul className="relative mt-8 space-y-3 text-white/85">
          {["Track every order live", "Save favorites to your wishlist", "Faster, prefilled checkout", "Exclusive member-only drops"].map((t) => (
            <li key={t} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-xs text-black">✓</span>{t}</li>
          ))}
        </ul>
      </div>
      <form onSubmit={submit} className="space-y-4 p-6 sm:p-10" noValidate>
        <div className="flex gap-1 rounded-full bg-white/5 p-1">
          {(["login", "register"] as const).map((m) => (
            <button key={m} type="button" onClick={() => { setMode(m); setError(""); }} className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${mode === m ? "bg-accent text-black" : "text-muted hover:text-white"}`}>
              {m === "login" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>
        <h1 className="font-display text-3xl font-bold">{mode === "login" ? "Welcome back" : "Join NEXORA"}</h1>
        {mode === "register" && <input className="field" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Full name" autoComplete="name" />}
        <input className="field" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email" autoComplete="email" />
        <input className="field" type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} aria-label="Password" autoComplete={mode === "login" ? "current-password" : "new-password"} />
        {error && <p className="rounded-xl bg-hot/15 px-4 py-2.5 text-sm text-hot" role="alert">{error}</p>}
        <button type="submit" disabled={busy} className="btn btn-primary w-full !py-4">{busy ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
        <p className="text-xs text-muted">Demo store: accounts live only in this browser and are never sent to a server.</p>
      </form>
    </div>
  );
}

export default function AccountView() {
  const router = useRouter();
  const sp = useSearchParams();
  const user = useStore((s) => s.user);
  const orders = useStore((s) => s.orders);
  const wishlist = useStore((s) => s.wishlist);
  const ready = useStore((s) => s.ready);
  const rawTab = sp.get("tab");
  const tab: Tab = TABS.some((t) => t.id === rawTab) ? (rawTab as Tab) : "overview";
  const [open, setOpen] = useState<string | null>(null);

  if (!ready) return <div className="h-96 animate-pulse rounded-3xl bg-surface" />;
  if (!user) return <AuthForm />;

  const spent = orders.reduce((n, o) => n + o.total, 0);
  const saved = wishlist.map((id) => getProduct(id)).filter((p): p is Product => Boolean(p));

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit space-y-4 rounded-3xl border border-line bg-surface p-5 lg:sticky lg:top-40">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-violet to-hot font-display text-2xl font-bold">{user.name[0]?.toUpperCase()}</span>
          <div className="min-w-0"><div className="truncate font-semibold">{user.name}</div><div className="truncate text-xs text-muted">{user.email}</div></div>
        </div>
        <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Account sections">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => router.replace(`/account?tab=${t.id}`, { scroll: false })} className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${tab === t.id ? "bg-accent text-black" : "hover:bg-white/10"}`} aria-current={tab === t.id ? "page" : undefined}>
              {t.label}
            </button>
          ))}
        </nav>
        <button type="button" onClick={logout} className="btn btn-ghost w-full">Sign out</button>
      </aside>

      <div>
        {tab === "overview" && (
          <div className="space-y-6">
            <h1 className="font-display text-4xl font-bold">Hi, {user.name.split(" ")[0]}</h1>
            <div className="grid gap-4 sm:grid-cols-3">
              {[["Orders", String(orders.length)], ["Total spent", money(spent)], ["Wishlist", String(wishlist.length)]].map(([k, v]) => (
                <div key={k} className="rounded-3xl border border-line bg-surface p-6"><div className="text-xs uppercase tracking-widest text-muted">{k}</div><div className="font-display mt-2 text-4xl font-bold">{v}</div></div>
              ))}
            </div>
            <div className="rounded-3xl border border-line bg-surface p-6">
              <h2 className="font-display mb-4 text-xl font-bold">Latest order</h2>
              {orders[0] ? (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div><div className="font-mono text-sm">{orders[0].id}</div><div className="text-xs text-muted">{dateLong(orders[0].createdAt)} · {money(orders[0].total)}</div></div>
                  <Link href={`/order/${orders[0].id}`} className="btn btn-ghost">Track order <ArrowRight width={16} height={16} /></Link>
                </div>
              ) : (
                <p className="text-muted">No orders yet. <Link href="/shop" className="text-accent hover:underline">Start shopping</Link></p>
              )}
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-bold">Order history</h1>
            {orders.length === 0 ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-line py-20 text-center"><PackageIcon width={40} height={40} className="text-muted" /><p className="mt-3 text-muted">You haven&apos;t placed any orders yet.</p><Link href="/shop" className="btn btn-primary mt-6">Shop now</Link></div>
            ) : orders.map((o) => (
              <article key={o.id} className="rounded-3xl border border-line bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><div className="font-mono text-sm font-semibold">{o.id}</div><div className="text-xs text-muted">{dateLong(o.createdAt)} · {o.lines.reduce((n, l) => n + l.qty, 0)} items</div></div>
                  <div className="flex items-center gap-3"><span className="font-display text-xl font-bold">{money(o.total)}</span>
                    <button type="button" onClick={() => setOpen(open === o.id ? null : o.id)} className="btn btn-ghost !py-2 text-xs" aria-expanded={open === o.id}>{open === o.id ? "Hide" : "Details"}</button>
                    <Link href={`/order/${o.id}`} className="btn btn-primary !py-2 text-xs">Track</Link>
                  </div>
                </div>
                {open === o.id && (
                  <div className="mt-5 space-y-5 border-t border-line pt-5">
                    <OrderLines order={o} />
                    <button type="button" className="btn btn-ghost" onClick={() => { o.lines.forEach((l) => addToCart({ productId: l.productId, color: l.color, size: l.size, qty: l.qty }, false)); toast("Items added to your cart"); }}>Buy again</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {tab === "wishlist" && (
          <div>
            <h1 className="font-display mb-6 text-4xl font-bold">Wishlist</h1>
            {saved.length === 0 ? <p className="text-muted">Nothing saved yet. Tap the heart on any product.</p> : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">{saved.map((p) => <ProductCard key={p.id} product={p} />)}</div>
            )}
          </div>
        )}

        {tab === "profile" && <ProfileForm key={user.id} />}
      </div>
    </div>
  );
}

function ProfileForm() {
  const user = useStore((s) => s.user)!;
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [line1, setLine1] = useState(user.address?.line1 ?? "");
  const [city, setCity] = useState(user.address?.city ?? "");
  const [state, setState] = useState(user.address?.state ?? "");
  const [zip, setZip] = useState(user.address?.zip ?? "");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast("Name is required", "error");
    updateProfile({ name: name.trim(), phone, address: { ...user.address, line1, city, state, zip } });
  };

  return (
    <form onSubmit={save} className="max-w-xl space-y-4" noValidate>
      <h1 className="font-display mb-2 text-4xl font-bold">Profile</h1>
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" aria-label="Full name" />
      <input className="field opacity-60" value={user.email} disabled aria-label="Email" />
      <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" aria-label="Phone" type="tel" />
      <input className="field" value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Street address" aria-label="Street address" />
      <div className="grid grid-cols-3 gap-3">
        <input className="field" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" aria-label="City" />
        <input className="field" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" aria-label="State" />
        <input className="field" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP" aria-label="ZIP" />
      </div>
      <button type="submit" className="btn btn-primary">Save changes</button>
    </form>
  );
}
