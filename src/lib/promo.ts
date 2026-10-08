import { prisma } from "./prisma";

export type PromoValidation =
  | { valid: false; reason: string }
  | {
      valid: true;
      code: string;
      type: "PERCENTAGE" | "FIXED";
      value: number;
      discount: number;
    };

export async function validatePromoCode(
  code: string,
  subtotal: number
): Promise<PromoValidation> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { valid: false, reason: "Veuillez saisir un code." };

  const promo = await prisma.promoCode.findUnique({
    where: { code: normalized },
  });

  if (!promo || !promo.active) {
    return { valid: false, reason: "Code promo invalide." };
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return { valid: false, reason: "Ce code promo a expiré." };
  }
  if (promo.maxUses != null && promo.uses >= promo.maxUses) {
    return { valid: false, reason: "Ce code promo a atteint sa limite d'utilisation." };
  }
  if (promo.minAmount && subtotal < Number(promo.minAmount)) {
    return {
      valid: false,
      reason: `Montant minimum requis : ${Number(promo.minAmount).toLocaleString("fr-FR")} FCFA.`,
    };
  }

  const value = Number(promo.value);
  let discount =
    promo.type === "PERCENTAGE" ? (subtotal * value) / 100 : value;
  discount = Math.min(discount, subtotal);
  discount = Math.round(discount * 100) / 100;

  return {
    valid: true,
    code: normalized,
    type: promo.type,
    value,
    discount,
  };
}

export async function incrementPromoUses(code: string) {
  if (!code) return;
  await prisma.promoCode.updateMany({
    where: { code: code.toUpperCase().trim() },
    data: { uses: { increment: 1 } },
  });
}
