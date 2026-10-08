import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non connecté." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "orderId requis." }, { status: 400 });
    }

    const sub = await prisma.subscription.findFirst({
      where: { orderId, userId: user.id },
    });
    if (!sub) {
      return NextResponse.json({ error: "Abonnement introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      status: sub.status,
      tier: sub.tier,
      endDate: sub.endDate,
    });
  } catch {
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}
