import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPlan } from "@/lib/plans";

async function activate(orderId: string) {
  const sub = await prisma.subscription.findUnique({ where: { orderId } });
  if (!sub) return;
  if (sub.status === "ACTIVE") return;

  const plan = getPlan(sub.tier);
  const start = new Date();
  const end = new Date(start.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

  await prisma.subscription.update({
    where: { orderId },
    data: { status: "ACTIVE", startDate: start, endDate: end },
  });

  // Un seul abonnement actif à la fois
  await prisma.subscription.updateMany({
    where: { userId: sub.userId, status: "ACTIVE", orderId: { not: orderId } },
    data: { status: "EXPIRED" },
  });
}

async function markFailed(orderId: string) {
  await prisma.subscription.updateMany({
    where: { orderId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") ?? "").toUpperCase();
  const orderId = searchParams.get("orderId");
  if (orderId) {
    if (status === "SUCCESS") await activate(orderId);
    else if (status === "FAILURE" || status === "FAILLURE") await markFailed(orderId);
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // ignore
  }

  const orderId =
    searchParams.get("orderId") ??
    (body.orderId as string) ??
    (body.order_id as string) ??
    (body.external_reference as string);
  const rawStatus =
    searchParams.get("status") ??
    (body.status as string) ??
    (body.transaction_status as string);
  const status = String(rawStatus ?? "").toUpperCase();

  if (orderId) {
    if (status === "SUCCESS") await activate(orderId);
    else if (status === "FAILURE" || status === "FAILLURE") await markFailed(orderId);
  }

  return NextResponse.json({ ok: true });
}
