export type Shape =
  | "headphones"
  | "buds"
  | "speaker"
  | "watch"
  | "laptop"
  | "keyboard"
  | "phone"
  | "camera"
  | "sneaker"
  | "hoodie"
  | "bag"
  | "lamp"
  | "chair";

export type ColorOption = { name: string; hex: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  shape: Shape;
  price: number;
  compareAt?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: "New" | "Best seller" | "Limited" | "Editor's pick";
  /** Two background gradient stops for the product art. */
  hues: [string, string];
  colors: ColorOption[];
  sizes?: string[];
  tagline: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  /** Optional real photo URLs. When present they replace the generated art. */
  images?: string[];
  addedAt: number;
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  hues: [string, string];
  shape: Shape;
};

export type CartLine = {
  key: string;
  productId: string;
  color?: string;
  size?: string;
  qty: number;
};

export type Address = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type ShippingMethod = "standard" | "express" | "overnight";

export type OrderLine = {
  productId: string;
  name: string;
  brand: string;
  shape: Shape;
  hues: [string, string];
  price: number;
  qty: number;
  color?: string;
  size?: string;
};

export type Order = {
  id: string;
  createdAt: number;
  lines: OrderLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  promo?: string;
  shippingMethod: ShippingMethod;
  payment: "card" | "cod";
  last4?: string;
  address: Address;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: number;
  verified: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Partial<Address>;
};

export type Toast = { id: number; message: string; tone: "success" | "info" | "error" };
