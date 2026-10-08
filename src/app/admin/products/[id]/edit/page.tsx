import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form";

export const metadata = { title: "Modifier produit — Admin" };

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="heading-lg">Modifier le produit</h1>
      <p className="mt-2 text-ink-muted">{product.title}</p>
      <div className="mt-8">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            title: product.title,
            categoryId: product.categoryId,
            price: Number(product.price),
            compareAtPrice: product.compareAtPrice
              ? Number(product.compareAtPrice)
              : null,
            sku: product.sku,
            inventory: product.inventory,
            description: product.description,
            details: product.details,
            images: product.images,
            featured: product.featured,
            status: product.status,
          }}
        />
      </div>
    </div>
  );
}
