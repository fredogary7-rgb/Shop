import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/category-form";
import { DeleteCategoryButton } from "@/components/delete-category-button";

export const metadata = { title: "Catégories — Admin" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="heading-lg">Catégories</h1>
      <p className="mt-2 text-ink-muted">
        Gérez les univers de votre boutique.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <CategoryForm />

        <div className="space-y-4 lg:col-span-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-4"
            >
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                {c.image && (
                  <Image src={c.image} alt={c.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-sm text-ink-muted">
                  /{c.slug} · {c._count.products} produit
                  {c._count.products > 1 ? "s" : ""}
                </p>
              </div>
              <DeleteCategoryButton id={c.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
