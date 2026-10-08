import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/product-form";

export const metadata = { title: "Nouveau produit — Admin" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="heading-lg">Ajouter un produit</h1>
      <p className="mt-2 text-ink-muted">
        Renseignez les informations du nouveau produit.
      </p>
      <div className="mt-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
