import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Boutique" };

type Props = {
  searchParams: { category?: string; sort?: string };
};

export default async function ProductsPage({ searchParams }: Props) {
  const category = searchParams.category;
  const sort = searchParams.sort ?? "newest";

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(category ? { category: { slug: category } } : {}),
      },
      orderBy:
        sort === "price-asc"
          ? { price: "asc" }
          : sort === "price-desc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  const mapped = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
  }));

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="shell py-12">
      <div className="mb-8">
        <p className="eyebrow">Boutique</p>
        <h1 className="heading-xl mt-2">
          {activeCategory ? activeCategory.name : "Tous les produits"}
        </h1>
        <p className="mt-3 max-w-xl text-ink-muted">
          {activeCategory?.description ??
            "Découvrez notre collection complète, pensée pour sublimer votre style au quotidien."}
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              !category
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 bg-white text-ink hover:border-ink"
            )}
          >
            Tous
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                category === c.slug
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/15 bg-white text-ink hover:border-ink"
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <form method="GET" action="/products" className="flex items-center gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="sort" className="text-sm text-ink-muted">
            Trier par
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={sort}
            className="input !w-auto !py-2"
          >
            <option value="newest">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <button type="submit" className="btn-outline !px-4 !py-2 text-sm">
            Appliquer
          </button>
        </form>
      </div>

      <p className="mb-6 text-sm text-ink-muted">
        {mapped.length} produit{mapped.length > 1 ? "s" : ""} trouvé
        {mapped.length > 1 ? "s" : ""}
      </p>

      {mapped.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {mapped.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <p className="font-serif text-2xl text-ink">Aucun produit trouvé</p>
          <p className="mt-2 text-ink-muted">
            Essayez de modifier vos filtres.
          </p>
          <Link href="/products" className="btn-primary mt-6 !px-6 !py-2.5 text-sm">
            Réinitialiser les filtres
          </Link>
        </div>
      )}
    </div>
  );
}
