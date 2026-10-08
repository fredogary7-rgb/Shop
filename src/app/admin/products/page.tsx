import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/delete-product-button";

export const metadata = { title: "Produits — Admin" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg">Produits</h1>
          <p className="mt-2 text-ink-muted">
            {products.length} produit{products.length > 1 ? "s" : ""} au total.
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary !px-5 !py-2.5 text-sm">
          <Plus className="h-4 w-4" />
          Ajouter un produit
        </Link>
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-6 py-3">Produit</th>
                <th className="px-6 py-3">Catégorie</th>
                <th className="px-6 py-3">Prix</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {products.map((p) => (
                <tr key={p.id} className="bg-white">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        {p.images[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.title}</p>
                        <p className="text-xs text-ink-subtle">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-ink-muted">{p.category.name}</td>
                  <td className="px-6 py-3 font-medium text-ink">
                    {formatPrice(Number(p.price))}
                  </td>
                  <td className="px-6 py-3 text-ink-muted">{p.inventory}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : p.status === "DRAFT"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.status === "ACTIVE"
                        ? "Actif"
                        : p.status === "DRAFT"
                          ? "Brouillon"
                          : "Archivé"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle transition hover:bg-ink/5 hover:text-ink"
                        aria-label="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
