import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Connectez-vous pour laisser un avis." },
      { status: 401 }
    );
  }

  const body = await req.json();
  const productId = body?.productId as string | undefined;
  const rating = Number(body?.rating);
  const title = (body?.title as string) || null;
  const comment = (body?.comment as string) || null;

  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Note invalide." }, { status: 400 });
  }

  const existing = await prisma.review.findFirst({
    where: { userId: user.id, productId },
  });

  if (existing) {
    await prisma.review.update({
      where: { id: existing.id },
      data: { rating, title, comment },
    });
  } else {
    await prisma.review.create({
      data: { userId: user.id, productId, rating, title, comment },
    });
  }

  return NextResponse.json({ ok: true });
}
