"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { productSchema, categorySchema } from "@/lib/validations";
import type { OrderStatus } from "@prisma/client";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès non autorisé.");
  }
  return user;
}

export async function createProduct(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    const baseSlug = slugify(d.title);
    const existing = await prisma.product.findUnique({ where: { slug: baseSlug } });
    const slug = existing ? `${baseSlug}-${Date.now().toString().slice(-4)}` : baseSlug;

    const product = await prisma.product.create({
      data: {
        title: d.title,
        slug,
        description: d.description,
        details: d.details ?? null,
        price: d.price,
        compareAtPrice: d.compareAtPrice ?? null,
        sku: d.sku,
        inventory: d.inventory,
        images: d.images,
        featured: d.featured ?? false,
        status: d.status ?? "ACTIVE",
        categoryId: d.categoryId,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { ok: true, id: product.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function updateProduct(
  id: string,
  input: unknown
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    await prisma.product.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description,
        details: d.details ?? null,
        price: d.price,
        compareAtPrice: d.compareAtPrice ?? null,
        sku: d.sku,
        inventory: d.inventory,
        images: d.images,
        featured: d.featured ?? false,
        status: d.status ?? "ACTIVE",
        categoryId: d.categoryId,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);
    revalidatePath("/");
    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    const orderCount = await prisma.orderItem.count({ where: { productId: id } });

    if (orderCount > 0) {
      await prisma.product.update({
        where: { id },
        data: { status: "ARCHIVED", inventory: 0 },
      });
      revalidatePath("/admin/products");
      return { ok: true, id };
    }

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function createCategory(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;
    const slug = slugify(d.name);

    const category = await prisma.category.create({
      data: {
        name: d.name,
        slug,
        description: d.description ?? null,
        image: d.image ?? null,
      },
    });

    revalidatePath("/admin/categories");
    return { ok: true, id: category.id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { ok: true, id };
  } catch {
    return {
      ok: false,
      error:
        "Impossible de supprimer cette catégorie (des produits y sont liés).",
    };
  }
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath("/admin/orders");
    return { ok: true, id };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function createPromoCode(input: unknown): Promise<ActionResult> {
  try {
    await requireAdmin();
    const d = input as {
      code?: string;
      type?: string;
      value?: string | number;
      minAmount?: string | number;
      maxUses?: string | number;
      expiresAt?: string;
    };
    if (!d.code || !d.value) {
      return { ok: false, error: "Code et valeur requis." };
    }

    await prisma.promoCode.create({
      data: {
        code: String(d.code).toUpperCase().trim(),
        type: d.type === "FIXED" ? "FIXED" : "PERCENTAGE",
        value: Number(d.value),
        minAmount: d.minAmount ? Number(d.minAmount) : null,
        maxUses: d.maxUses ? Number(d.maxUses) : null,
        expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
      },
    });

    revalidatePath("/admin/promos");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}

export async function deletePromoCode(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await prisma.promoCode.delete({ where: { id } });
    revalidatePath("/admin/promos");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}
