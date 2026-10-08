import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  category: { name: string; slug: string } | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dark">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-subtle">
            Aucune image
          </div>
        )}
        {discount !== null && (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-cream">
            -{discount}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
          {product.category?.name}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
          {product.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-ink-subtle line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
