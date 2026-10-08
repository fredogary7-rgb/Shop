import { NextResponse } from "next/server";
import { activateSubscription, failSubscription } from "@/lib/subscription";

function orderIdFrom(url: URL): string | null {
  return url.searchParams.get("orderId");
}

function statusFrom(url: URL): string {
  return (url.searchParams.get("status") ?? "").toUpperCase();
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = orderIdFrom(url);
  const status = statusFrom(url);
  if (orderId) {
    if (status === "SUCCESS") await activateSubscription(orderId);
    else if (status === "FAILURE" || status === "FAILLURE") await failSubscription(orderId);
  }
  return NextResponse.json({ ok: true });
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    // ignore
  }

  const orderId =
    url.searchParams.get("orderId") ??
    (body.orderId as string) ??
    (body.order_id as string) ??
    (body.external_reference as string);
  const rawStatus =
    url.searchParams.get("status") ??
    (body.status as string) ??
    (body.transaction_status as string);
  const status = String(rawStatus ?? "").toUpperCase();

  if (orderId) {
    if (status === "SUCCESS") await activateSubscription(orderId);
    else if (status === "FAILURE" || status === "FAILLURE") await failSubscription(orderId);
  }

  return NextResponse.json({ ok: true });
}
