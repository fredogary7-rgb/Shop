"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/admin";
import { useToast } from "@/context/toast-context";

type CategoryOption = { id: string; name: string };

type ProductInput = {
  id: string;
  title: string;
  categoryId: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  inventory: number;
  description: string;
  details: string | null;
  images: string[];
  featured: boolean;
  status: string;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ProductInput;
}) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    title: product?.title ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    price: product ? String(product.price) : "",
    compareAtPrice:
      product?.compareAtPrice != null ? String(product.compareAtPrice) : "",
    sku: product?.sku ?? "",
    inventory: product ? String(product.inventory) : "0",
    description: product?.description ?? "",
    details: product?.details ?? "",
    images: product?.images.join("\n") ?? "",
    featured: product?.featured ?? false,
    status: product?.status ?? "ACTIVE",
  });
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      categoryId: form.categoryId,
      price: Number(form.price),
      compareAtPrice:
        form.compareAtPrice === "" ? undefined : Number(form.compareAtPrice),
      sku: form.sku,
      inventory: Number(form.inventory),
      description: form.description,
      details: form.details || undefined,
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.featured,
      status: form.status,
    };

    startTransition(async () => {
      const res = isEdit
        ? await updateProduct(product!.id, payload)
        : await createProduct(payload);
      if (res.ok) {
        toast(isEdit ? "Produit mis à jour !" : "Produit créé !");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast(res.error, "error");
      }
    });
  };

  return (
    <form onSubmit={submit} className="card space-y-5 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Titre *</label>
          <input
            required
            value={form.title}
            onChange={update("title")}
            className="input"
          />
        </div>

        <div>
          <label className="label">Catégorie *</label>
          <select
            required
            value={form.categoryId}
            onChange={update("categoryId")}
            className="input"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Statut</label>
          <select value={form.status} onChange={update("status")} className="input">
            <option value="ACTIVE">Actif</option>
            <option value="DRAFT">Brouillon</option>
            <option value="ARCHIVED">Archivé</option>
          </select>
        </div>

        <div>
          <label className="label">Prix (€) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={update("price")}
            className="input"
          />
        </div>

        <div>
          <label className="label">Prix barré (€)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.compareAtPrice}
            onChange={update("compareAtPrice")}
            className="input"
            placeholder="Optionnel"
          />
        </div>

        <div>
          <label className="label">SKU *</label>
          <input required value={form.sku} onChange={update("sku")} className="input" />
        </div>

        <div>
          <label className="label">Stock *</label>
          <input
            type="number"
            min="0"
            required
            value={form.inventory}
            onChange={update("inventory")}
            className="input"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Description courte *</label>
          <textarea
            required
            rows={2}
            value={form.description}
            onChange={update("description")}
            className="input resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Détails &amp; entretien</label>
          <textarea
            rows={3}
            value={form.details}
            onChange={update("details")}
            className="input resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">Images (une URL par ligne)</label>
          <textarea
            rows={3}
            value={form.images}
            onChange={update("images")}
            className="input resize-none font-mono text-xs"
            placeholder="https://images.unsplash.com/photo-…"
          />
        </div>

        <label className="flex items-center gap-2.5 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            className="h-4 w-4 accent-gold-500"
          />
          <span className="text-sm font-medium text-ink">
            Mettre en avant (page d&apos;accueil)
          </span>
        </label>
      </div>

      <div className="flex gap-3 border-t border-ink/10 pt-5">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary !px-8 !py-3 text-sm disabled:opacity-60"
        >
          {pending
            ? "Enregistrement…"
            : isEdit
              ? "Mettre à jour"
              : "Créer le produit"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-outline !px-6 !py-3 text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
