import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Fills its (relatively positioned) parent with an optimized Unsplash photo. */
export default function ProductImage({ src, alt, sizes, priority = false, className = "" }: Props) {
  if (!src) return <div className="h-full w-full bg-surface2" />;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />;
}
