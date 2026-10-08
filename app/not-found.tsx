import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-2xl place-items-center px-4 py-32 text-center">
      <div className="font-display shimmer-text text-[9rem] font-extrabold leading-none">404</div>
      <h1 className="font-display mt-2 text-3xl font-bold">This page took a day off</h1>
      <p className="mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/shop" className="btn btn-primary mt-8">Back to shopping</Link>
    </div>
  );
}
