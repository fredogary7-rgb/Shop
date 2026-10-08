import { prisma } from "./prisma";
import { getPlan } from "./plans";

export async function getActiveSubscription(userId: string) {
  const now = new Date();
  return prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
      OR: [{ endDate: null }, { endDate: { gt: now } }],
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getActiveSubscription(userId);
  return !!sub;
}

export async function activateSubscription(orderId: string) {
  const sub = await prisma.subscription.findUnique({ where: { orderId } });
  if (!sub || sub.status === "ACTIVE") return;

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

export async function failSubscription(orderId: string) {
  await prisma.subscription.updateMany({
    where: { orderId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
}

