import type { Metadata } from "next";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const metadata: Metadata = { title: "Recherche" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim() ?? "";

  const products = q
    ? await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { sku: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { category: true },
        take: 24,
      })
    : [];

  const mapped = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
  }));

  return (
    <div className="shell py-12">
      <h1 className="heading-lg">Recherche</h1>

      <form method="GET" action="/search" className="mt-6 max-w-xl">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Rechercher un produit, une référence…"
            className="input !pl-11 !py-4"
          />
        </div>
      </form>

      {q && (
        <p className="mt-6 text-sm text-ink-muted">
          {mapped.length} résultat{mapped.length > 1 ? "s" : ""} pour{" "}
          <span className="font-semibold text-ink">&ldquo;{q}&rdquo;</span>
        </p>
      )}

      {q && mapped.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <p className="font-serif text-2xl text-ink">Aucun résultat</p>
          <p className="mt-2 text-ink-muted">
            Essayez avec un autre mot-clé.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {mapped.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
