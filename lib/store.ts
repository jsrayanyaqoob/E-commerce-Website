"use client";

import { useSyncExternalStore } from "react";
import { getProduct } from "./products";
import type { CartLine, Order, Review, Toast, User } from "./types";

/**
 * A tiny external store persisted to localStorage.
 * Everything here is client-side demo state: there is no backend.
 */

type State = {
  cart: CartLine[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  reviews: Record<string, Review[]>;
  recent: string[];
  promo: string;
  drawerOpen: boolean;
  toasts: Toast[];
  ready: boolean;
};

type StoredUser = User & { hash: string };

const KEYS = {
  cart: "nx.cart",
  wishlist: "nx.wishlist",
  user: "nx.session",
  users: "nx.users",
  orders: "nx.orders",
  reviews: "nx.reviews",
  recent: "nx.recent",
  promo: "nx.promo",
} as const;

const EMPTY: State = {
  cart: [],
  wishlist: [],
  user: null,
  orders: [],
  reviews: {},
  recent: [],
  promo: "",
  drawerOpen: false,
  toasts: [],
  ready: false,
};

let state: State = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage may be full or blocked; the app keeps working in-memory */
  }
}

function load() {
  state = {
    ...state,
    cart: read(KEYS.cart, []),
    wishlist: read(KEYS.wishlist, []),
    user: read(KEYS.user, null),
    orders: read(KEYS.orders, []),
    reviews: read(KEYS.reviews, {}),
    recent: read(KEYS.recent, []),
    promo: read(KEYS.promo, ""),
    ready: true,
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(listener: () => void) {
  if (typeof window !== "undefined" && !hydrated) {
    hydrated = true;
    // Defer so the first client render matches the server snapshot, then hydrate.
    queueMicrotask(() => {
      load();
      emit();
    });
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("nx.")) {
        load();
        emit();
      }
    });
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(EMPTY),
  );
}

/* ---------- cart ---------- */

export const cartKey = (productId: string, color?: string, size?: string) =>
  [productId, color ?? "", size ?? ""].join("|");

export function addToCart(input: { productId: string; color?: string; size?: string; qty?: number }, openDrawer = true) {
  const product = getProduct(input.productId);
  if (!product) return;
  const key = cartKey(input.productId, input.color, input.size);
  const qty = input.qty ?? 1;
  const existing = state.cart.find((l) => l.key === key);
  const nextQty = Math.min(product.stock, (existing?.qty ?? 0) + qty);
  const cart = existing
    ? state.cart.map((l) => (l.key === key ? { ...l, qty: nextQty } : l))
    : [...state.cart, { key, productId: input.productId, color: input.color, size: input.size, qty: nextQty }];
  write(KEYS.cart, cart);
  set({ cart, drawerOpen: openDrawer ? true : state.drawerOpen });
  if (nextQty === product.stock && (existing?.qty ?? 0) + qty > product.stock) {
    toast(`Only ${product.stock} in stock`, "info");
  }
}

export function setQty(key: string, qty: number) {
  const line = state.cart.find((l) => l.key === key);
  const product = line && getProduct(line.productId);
  if (!line || !product) return;
  const clamped = Math.max(0, Math.min(product.stock, qty));
  const cart = clamped === 0 ? state.cart.filter((l) => l.key !== key) : state.cart.map((l) => (l.key === key ? { ...l, qty: clamped } : l));
  write(KEYS.cart, cart);
  set({ cart });
}

export function removeLine(key: string) {
  const cart = state.cart.filter((l) => l.key !== key);
  write(KEYS.cart, cart);
  set({ cart });
}

export function clearCart() {
  write(KEYS.cart, []);
  write(KEYS.promo, "");
  set({ cart: [], promo: "" });
}

export function setPromo(code: string) {
  write(KEYS.promo, code);
  set({ promo: code });
}

export function setDrawer(open: boolean) {
  set({ drawerOpen: open });
}

/* ---------- wishlist / recently viewed ---------- */

export function toggleWishlist(productId: string) {
  const has = state.wishlist.includes(productId);
  const wishlist = has ? state.wishlist.filter((id) => id !== productId) : [productId, ...state.wishlist];
  write(KEYS.wishlist, wishlist);
  set({ wishlist });
  toast(has ? "Removed from wishlist" : "Saved to wishlist", has ? "info" : "success");
}

export function pushRecent(productId: string) {
  if (state.recent[0] === productId) return;
  const recent = [productId, ...state.recent.filter((id) => id !== productId)].slice(0, 8);
  write(KEYS.recent, recent);
  set({ recent });
}

/* ---------- toasts ---------- */

let toastId = 0;
export function toast(message: string, tone: Toast["tone"] = "success") {
  const id = ++toastId;
  set({ toasts: [...state.toasts, { id, message, tone }] });
  setTimeout(() => dismissToast(id), 3200);
}

export function dismissToast(id: number) {
  set({ toasts: state.toasts.filter((t) => t.id !== id) });
}

/* ---------- auth (demo only: hashed locally, never leaves the browser) ---------- */

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function publicUser(u: StoredUser): User {
  const { hash: _hash, ...rest } = u;
  void _hash;
  return rest;
}

export async function register(name: string, email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = read<StoredUser[]>(KEYS.users, []);
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) return { ok: false, error: "An account with that email already exists." };
  const user: StoredUser = { id: `u_${Date.now().toString(36)}`, name: name.trim(), email: normalized, hash: await sha256(`${normalized}:${password}`) };
  write(KEYS.users, [...users, user]);
  const session = publicUser(user);
  write(KEYS.user, session);
  set({ user: session });
  toast(`Welcome to NEXORA, ${session.name.split(" ")[0]}!`);
  return { ok: true };
}

export async function login(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const users = read<StoredUser[]>(KEYS.users, []);
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email === normalized);
  if (!user || user.hash !== (await sha256(`${normalized}:${password}`))) return { ok: false, error: "Incorrect email or password." };
  const session = publicUser(user);
  write(KEYS.user, session);
  set({ user: session });
  toast(`Welcome back, ${session.name.split(" ")[0]}!`);
  return { ok: true };
}

export function logout() {
  write(KEYS.user, null);
  set({ user: null });
  toast("Signed out", "info");
}

export function updateProfile(patch: Partial<User>) {
  if (!state.user) return;
  const user = { ...state.user, ...patch };
  const users = read<StoredUser[]>(KEYS.users, []).map((u) => (u.id === user.id ? { ...u, ...patch } : u));
  write(KEYS.users, users);
  write(KEYS.user, user);
  set({ user });
  toast("Profile updated");
}

/* ---------- orders & reviews ---------- */

export function placeOrder(order: Order) {
  const orders = [order, ...state.orders];
  write(KEYS.orders, orders);
  write(KEYS.cart, []);
  write(KEYS.promo, "");
  set({ orders, cart: [], promo: "", drawerOpen: false });
}

export function addReview(productId: string, review: Review) {
  const reviews = { ...state.reviews, [productId]: [review, ...(state.reviews[productId] ?? [])] };
  write(KEYS.reviews, reviews);
  set({ reviews });
  toast("Thanks for your review!");
}
