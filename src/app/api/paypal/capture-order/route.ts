import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPayPalAccessToken, PAYPAL_API_BASE } from "@/lib/paypal";
import { activateSubscription } from "@/lib/subscription";

const PENDING_COOKIE = "moretti_pending_sub";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderID = body?.orderID as string | undefined;
    if (!orderID) {
      return NextResponse.json({ error: "orderID manquant." }, { status: 400 });
    }

    const token = await getPayPalAccessToken();
    const res = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    if (!res.ok || data.status !== "COMPLETED") {
      return NextResponse.json(
        { error: data.message ?? "Capture du paiement échouée." },
        { status: 502 }
      );
    }

    const pendingOrderId = cookies().get(PENDING_COOKIE)?.value;
    if (pendingOrderId) {
      await activateSubscription(pendingOrderId);
      cookies().set(PENDING_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
