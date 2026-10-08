import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";
import { getCountry } from "@/lib/soleaspay";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
    }

    const body = await req.json();
    const { tier, countryCode, serviceId, phone } = body ?? {};

    const plan = getPlan(String(tier));
    const country = getCountry(String(countryCode));
    if (!country) {
      return NextResponse.json({ error: "Pays invalide." }, { status: 400 });
    }
    if (!phone || String(phone).trim().length < 6) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }
    const service = country.services.find((s) => s.id === Number(serviceId));
    if (!service) {
      return NextResponse.json({ error: "Opérateur mobile invalide." }, { status: 400 });
    }

    const orderId = `MOR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const amount = plan.priceFCFA;
    const currency = country.currency;

    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: plan.id,
        status: "PENDING",
        provider: "SOLEASPAY",
        orderId,
        amount,
        currency,
      },
    });

    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const apiKey = process.env.SOLEASPAY_API_KEY;
    const base = process.env.SOLEASPAY_BASE_URL ?? "https://soleaspay.com";

    let res: Response;
    try {
      res = await fetch(`${base}/api/agent/bills/v3`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey ?? "",
          operation: "2",
          service: String(service.id),
        },
        body: JSON.stringify({
          wallet: String(phone).trim(),
          amount,
          currency,
          order_id: orderId,
          description: `Abonnement Moretti Shop - ${plan.name}`,
          payer: user.name,
          payerEmail: user.email,
          successUrl: `${baseUrl}/api/webhooks/soleaspay?status=SUCCESS&orderId=${orderId}`,
          failureUrl: `${baseUrl}/api/webhooks/soleaspay?status=FAILURE&orderId=${orderId}`,
        }),
      });
    } catch {
      await prisma.subscription.update({
        where: { orderId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(
        { error: "Impossible de contacter Soleaspay. Réessayez." },
        { status: 502 }
      );
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      await prisma.subscription.update({
        where: { orderId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(
        { error: data.message ?? "Échec de l'initiation du paiement." },
        { status: 502 }
      );
    }

    const reference =
      data.data?.reference ?? data.data?.transaction_reference ?? null;
    if (reference) {
      await prisma.subscription.update({
        where: { orderId },
        data: { reference },
      });
    }

    return NextResponse.json({
      ok: true,
      orderId,
      reference,
      status: data.status ?? "PROCESSING",
    });
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue. Réessayez." },
      { status: 500 }
    );
  }
}
