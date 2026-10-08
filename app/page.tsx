import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { CATEGORY_PHOTOS } from "@/lib/photos";
import ProductCard from "@/components/ProductCard";
import Countdown from "@/components/Countdown";
import RecentlyViewed from "@/components/RecentlyViewed";
import { ArrowRight, BoltIcon, HeadsetIcon, RefreshIcon, ShieldIcon, TruckIcon } from "@/components/Icons";
import Stars from "@/components/Stars";
import { categories, discountPct, getProduct, products } from "@/lib/products";
import { money } from "@/lib/format";

const BRANDS = ["Auralux", "Pulse", "Orbitek", "Pixelon", "Lumen", "Kinetic", "Northfold", "Strata", "Halcyon", "Boomline", "Keystone"];

const TESTIMONIALS = [
  { name: "Maya R.", role: "Verified buyer", text: "Delivery in two days and the Studio Pro headphones are unreal. Checkout took under a minute.", rating: 5 },
  { name: "Daniel K.", role: "Verified buyer", text: "Returns were painless. Labeled, dropped off, refunded. This is how every store should work.", rating: 5 },
  { name: "Sofia L.", role: "Verified buyer", text: "The Everyday backpack is the best bag I've owned. Love how clear the product pages are.", rating: 5 },
];

export default function Home() {
  const deals = [...products].filter((p) => p.compareAt).sort((a, b) => discountPct(b) - discountPct(a)).slice(0, 4);
  const trending = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  const newest = [...products].sort((a, b) => b.addedAt - a.addedAt).slice(0, 4);
  const hero = [getProduct("p01")!, getProduct("p14")!, getProduct("p04")!];

  return (
    <>
      {/* HERO */}
      <section className="grain relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-violet/35 blur-[140px]" />
        <div className="pointer-events-none absolute -right-32 top-20 h-[460px] w-[460px] rounded-full bg-accent/20 blur-[140px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-hot/20 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-24">
          <div className="reveal">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-accent">
              <BoltIcon width={14} height={14} /> The Autumn Drop is live
            </span>
            <h1 className="font-display mt-6 text-[clamp(2.8rem,8vw,6.6rem)] font-extrabold leading-[.92]">
              Gear that
              <br />
              <span className="shimmer-text">moves with you.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              Flagship tech, performance footwear and design-led home pieces from 11 brands we obsess over. Free shipping over $75, 30-day returns, zero small print.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-primary !px-7 !py-4 text-base">
                Shop the collection <ArrowRight width={18} height={18} />
              </Link>
              <Link href="/deals" className="btn btn-ghost !px-7 !py-4 text-base">
                Today&apos;s deals
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {[
                ["2M+", "Happy customers"],
                ["4.8★", "Average rating"],
                ["48h", "Avg. delivery"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-bold">{v}</dt>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[520px]">
            <Link href={`/product/${hero[0].slug}`} className="card-hover absolute left-0 top-6 h-[72%] w-[58%] -rotate-3 overflow-hidden rounded-[2rem] border border-line shadow-2xl">
              <ProductImage src={hero[0].images?.[0]} alt={hero[0].name} sizes="(min-width:1024px) 330px, 55vw" priority />
              <span className="glass absolute bottom-3 left-3 right-3 rounded-2xl px-3 py-2 text-sm font-semibold">
                {hero[0].name} <span className="text-accent">{money(hero[0].price)}</span>
              </span>
            </Link>
            <Link href={`/product/${hero[1].slug}`} className="card-hover absolute right-0 top-0 h-[52%] w-[46%] rotate-6 overflow-hidden rounded-[2rem] border border-line shadow-2xl">
              <ProductImage src={hero[1].images?.[0]} alt={hero[1].name} sizes="(min-width:1024px) 260px, 45vw" priority />
            </Link>
            <Link href={`/product/${hero[2].slug}`} className="card-hover absolute bottom-0 right-6 h-[46%] w-[48%] rotate-2 overflow-hidden rounded-[2rem] border border-line shadow-2xl">
              <ProductImage src={hero[2].images?.[0]} alt={hero[2].name} sizes="(min-width:1024px) 270px, 45vw" priority />
              <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-accent">New</span>
            </Link>
            <div className="glass absolute -left-2 bottom-10 hidden animate-float items-center gap-3 rounded-2xl p-3 sm:flex">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-black">
                <TruckIcon />
              </span>
              <span className="text-sm font-semibold">
                Free delivery
                <span className="block text-xs font-normal text-muted">on orders over $75</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STRIP */}
      <section aria-label="Brands" className="overflow-hidden border-y border-line bg-surface/60 py-5">
        <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
          {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
            <span key={i} className="font-display text-2xl font-extrabold uppercase tracking-tight text-white/30">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold sm:text-5xl">Shop by category</h2>
          <Link href="/shop" className="hidden items-center gap-2 text-sm text-muted hover:text-accent sm:flex">
            View all <ArrowRight width={16} height={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className={`card-hover group relative overflow-hidden rounded-3xl border border-line ${i === 0 || i === 5 ? "md:col-span-2" : ""} aspect-[4/3] md:aspect-auto md:h-64`}
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <ProductImage src={CATEGORY_PHOTOS[c.slug]} alt={c.name} sizes="(min-width:768px) 25vw, 50vw" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <div className="font-display text-2xl font-bold">{c.name}</div>
                  <div className="text-xs text-white/70">{c.tagline}</div>
                </div>
                <span className="glass grid h-10 w-10 place-items-center rounded-full transition group-hover:bg-accent group-hover:text-black">
                  <ArrowRight width={18} height={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-[#1a0f2e] via-surface to-[#0d1a14] p-5 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-hot/25 blur-[100px]" />
          <div className="relative mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-hot px-3 py-1 text-xs font-bold uppercase tracking-widest">
                <BoltIcon width={14} height={14} /> Flash deals
              </span>
              <h2 className="font-display mt-4 text-3xl font-bold sm:text-5xl">Biggest drops, ending soon</h2>
            </div>
            <Countdown />
          </div>
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="relative mt-8 text-center">
            <Link href="/deals" className="btn btn-ghost">
              See all deals <ArrowRight width={18} height={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Trending now</p>
            <h2 className="font-display text-3xl font-bold sm:text-5xl">What everyone&apos;s buying</h2>
          </div>
          <Link href="/shop?sort=popular" className="hidden items-center gap-2 text-sm text-muted hover:text-accent sm:flex">
            Shop best sellers <ArrowRight width={16} height={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* BENTO PROMOS */}
      <section className="mx-auto mt-24 grid max-w-[1400px] gap-4 px-4 sm:px-6 lg:grid-cols-3">
        <Link href="/shop?category=computing" className="card-hover group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-line lg:col-span-2">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <ProductImage src={CATEGORY_PHOTOS.computing} alt="Laptop on a desk" sizes="(min-width:1024px) 66vw, 100vw" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          <div className="relative flex h-full max-w-md flex-col justify-end p-8">
            <span className="text-sm font-semibold uppercase tracking-widest text-sky-300">Computing</span>
            <h3 className="font-display mt-2 text-4xl font-bold leading-tight">Built for the ones who build.</h3>
            <span className="mt-4 inline-flex items-center gap-2 font-semibold text-accent">
              Shop laptops &amp; gear <ArrowRight width={18} height={18} />
            </span>
          </div>
        </Link>
        <div className="grid gap-4">
          <Link href="/shop?category=footwear" className="card-hover group relative min-h-[170px] overflow-hidden rounded-[2rem] border border-line">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <ProductImage src={CATEGORY_PHOTOS.footwear} alt="Running shoe" sizes="(min-width:1024px) 33vw, 100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <h3 className="font-display text-2xl font-bold">Run faster.</h3>
              <span className="text-sm text-white/70">Footwear from $99</span>
            </div>
          </Link>
          <Link href="/shop?category=home" className="card-hover group relative min-h-[170px] overflow-hidden rounded-[2rem] border border-line">
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
              <ProductImage src={CATEGORY_PHOTOS.home} alt="Lounge chair" sizes="(min-width:1024px) 33vw, 100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-6">
              <h3 className="font-display text-2xl font-bold">Nest better.</h3>
              <span className="text-sm text-white/70">Up to 25% off furniture</span>
            </div>
          </Link>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Just landed</p>
          <h2 className="font-display text-3xl font-bold sm:text-5xl">New arrivals</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <RecentlyViewed />

      {/* BENEFITS */}
      <section className="mx-auto mt-24 grid max-w-[1400px] gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {[
          { icon: TruckIcon, title: "Free shipping", text: "On every order over $75, shipped within 24h." },
          { icon: RefreshIcon, title: "30-day returns", text: "Not feeling it? Send it back, no questions." },
          { icon: ShieldIcon, title: "Secure checkout", text: "Encrypted payments and buyer protection." },
          { icon: HeadsetIcon, title: "Human support", text: "Real people, 7 days a week, in minutes." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-3xl border border-line bg-surface p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
              <Icon width={24} height={24} />
            </span>
            <h3 className="font-display mt-4 text-xl font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-24 max-w-[1400px] px-4 sm:px-6">
        <h2 className="font-display mb-8 text-center text-3xl font-bold sm:text-5xl">Loved by customers</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-3xl border border-line bg-surface p-6">
              <Stars rating={t.rating} size={18} />
              <blockquote className="mt-4 text-lg leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-sm">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet to-hot font-bold">{t.name[0]}</span>
                <span>
                  <b>{t.name}</b>
                  <span className="block text-xs text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-muted">Sample testimonials for the demo store.</p>
      </section>
    </>
  );
}
