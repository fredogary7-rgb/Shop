import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";

const PENDING_COOKIE = "moretti_pending_sub";

export async function POST() {
  try {
    const orderId = cookies().get(PENDING_COOKIE)?.value;
    if (!orderId) {
      return NextResponse.json(
        { error: "Aucun abonnement en attente." },
        { status: 400 }
      );
    }

    const sub = await prisma.subscription.findUnique({ where: { orderId } });
    if (!sub) {
      return NextResponse.json(
        { error: "Abonnement introuvable." },
        { status: 404 }
      );
    }

    const plan = getPlan(sub.tier);
    const token = await getPayPalAccessToken();

    const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `Abonnement Moretti Shop - ${plan.name}`,
            amount: {
              currency_code: "USD",
              value: plan.priceUSD.toFixed(2),
            },
          },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? "Échec de création de la commande PayPal." },
        { status: 502 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
