import { NextResponse } from "next/server";
import { validatePromoCode } from "@/lib/promo";

export async function POST(req: Request) {
  const body = await req.json();
  const code = String(body?.code ?? "");
  const subtotal = Number(body?.subtotal ?? 0);
  const result = await validatePromoCode(code, subtotal);
  return NextResponse.json(result);
}
