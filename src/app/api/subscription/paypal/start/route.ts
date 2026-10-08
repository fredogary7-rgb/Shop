import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getPlan } from "@/lib/plans";

const PENDING_COOKIE = "moretti_pending_sub";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Vous devez être connecté." }, { status: 401 });
    }

    const body = await req.json();
    const plan = getPlan(String(body?.tier ?? ""));
    const orderId = `PP-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    await prisma.subscription.create({
      data: {
        userId: user.id,
        tier: plan.id,
        status: "PENDING",
        provider: "PAYPAL",
        orderId,
        amount: plan.priceUSD,
        currency: "USD",
      },
    });

    const res = NextResponse.json({ ok: true, orderId });
    res.cookies.set(PENDING_COOKIE, orderId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 30,
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
