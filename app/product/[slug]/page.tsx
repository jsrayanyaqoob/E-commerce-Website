import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";
import RecentlyViewed from "@/components/RecentlyViewed";
import { getProduct, products, related } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return { title: `${product.brand} ${product.name}`, description: product.tagline };
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <ProductDetail product={product} />

      <section className="mt-24">
        <h2 className="font-display mb-6 text-3xl font-bold sm:text-4xl">You may also like</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {related(product, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      <div className="-mx-4 sm:-mx-6">
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto h-[70vh] max-w-[1400px] animate-pulse px-4 py-8 sm:px-6"><div className="h-full rounded-[2rem] bg-surface" /></div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}
