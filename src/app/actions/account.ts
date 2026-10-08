"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validations";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProfile(input: unknown): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, error: "Vous devez être connecté." };

    const parsed = profileSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0].message };
    }
    const d = parsed.data;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: d.name,
        phone: d.phone || null,
        address: d.address || null,
        city: d.city || null,
        country: d.country || null,
        postalCode: d.postalCode || null,
      },
    });

    revalidatePath("/account");
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Une erreur est survenue.",
    };
  }
}
