import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { activateSubscription } from "@/lib/subscription";

const PENDING_COOKIE = "moretti_pending_sub";

export async function GET(req: Request) {
  const orderId = cookies().get(PENDING_COOKIE)?.value;

  if (orderId) {
    await activateSubscription(orderId);
    cookies().set(PENDING_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
  }

  return NextResponse.redirect(new URL("/abonnement?paypal=success", req.url));
}
