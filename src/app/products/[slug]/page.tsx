import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { WishlistButton } from "@/components/wishlist-button";
import { StarRating } from "@/components/star-rating";
import { ReviewForm } from "@/components/review-form";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });
  return { title: product?.title ?? "Produit" };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: "ACTIVE",
      NOT: { id: product.id },
    },
    take: 4,
    include: { category: true },
  });

  const [reviews, reviewAgg] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    }),
  ]);

  const avgRating = Number(reviewAgg._avg.rating ?? 0);
  const reviewCount = reviewAgg._count;

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;
  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round((1 - price / compareAtPrice) * 100)
      : null;
  const inStock = product.inventory > 0;

  const mappedRelated = related.map((p) => ({
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
  }));

  return (
    <div className="shell py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-ink-muted">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-ink">
          Boutique
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-ink"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative">
          <ProductGallery images={product.images} title={product.title} />
          <WishlistButton
            productId={product.id}
            className="absolute right-3 top-3 z-10"
          />
        </div>

        <div>
          <p className="eyebrow">{product.category.name}</p>
          <h1 className="heading-lg mt-2">{product.title}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-semibold text-ink">
              {formatPrice(price)}
            </span>
            {compareAtPrice && compareAtPrice > price && (
              <span className="text-lg text-ink-subtle line-through">
                {formatPrice(compareAtPrice)}
              </span>
            )}
            {discount !== null && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-cream">
                -{discount}%
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <div className="mt-6">
            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                price,
                image: product.images[0] ?? "",
              }}
              disabled={!inStock}
            />
          </div>

          <div className="mt-6 space-y-2.5 rounded-2xl border border-ink/10 bg-white p-5 text-sm">
            <p className="flex items-center justify-between">
              <span className="text-ink-muted">Référence</span>
              <span className="font-medium text-ink">{product.sku}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-ink-muted">Disponibilité</span>
              <span className="font-medium text-ink">
                {inStock
                  ? product.inventory < 10
                    ? `Plus que ${product.inventory} en stock`
                    : "En stock"
                  : "Épuisé"}
              </span>
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { Icon: Truck, label: "Livraison 48h" },
              { Icon: RotateCcw, label: "Retours 30 jours" },
              { Icon: ShieldCheck, label: "Paiement sécurisé" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1.5 rounded-xl bg-cream px-3 py-4 text-center"
              >
                <Icon className="h-5 w-5 text-gold-600" />
                <span className="text-xs font-medium text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {product.details && (
        <section className="mt-16">
          <h2 className="heading-lg">Détails &amp; entretien</h2>
          <p className="mt-4 max-w-3xl whitespace-pre-line leading-relaxed text-ink-muted">
            {product.details}
          </p>
        </section>
      )}

      <section className="mt-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="heading-lg">Avis clients</h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={avgRating} size={18} />
              <span className="text-sm text-ink-muted">
                {avgRating.toFixed(1)} / 5 · {reviewCount} avis
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-8 text-center text-ink-muted">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-ink">{r.user.name}</p>
                      <span className="text-xs text-ink-subtle">
                        {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <div className="mt-2">
                      <StarRating rating={r.rating} />
                    </div>
                    {r.title && (
                      <p className="mt-2 font-medium text-ink">{r.title}</p>
                    )}
                    {r.comment && (
                      <p className="mt-1 text-sm text-ink-muted">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <ReviewForm productId={product.id} />
        </div>
      </section>

      {mappedRelated.length > 0 && (
        <section className="mt-16">
          <h2 className="heading-lg mb-8">Vous aimerez aussi</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {mappedRelated.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
