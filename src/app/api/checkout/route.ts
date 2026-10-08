import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validations";
import { getCurrentUser } from "@/lib/auth";
import {
  generateOrderNumber,
  SHIPPING_FLAT_RATE,
  TAX_RATE,
} from "@/lib/utils";
import { validatePromoCode, incrementPromoUses } from "@/lib/promo";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const user = await getCurrentUser();

    const subtotal = data.items.reduce(
      (acc, i) => acc + i.price * i.quantity,
      0
    );

    let discount = 0;
    let promoCode: string | null = null;
    if (data.promoCode) {
      const promo = await validatePromoCode(data.promoCode, subtotal);
      if (promo.valid) {
        discount = promo.discount;
        promoCode = promo.code;
      }
    }

    const discountedSubtotal = Math.round((subtotal - discount) * 100) / 100;
    const shipping = discountedSubtotal >= 80 ? 0 : SHIPPING_FLAT_RATE;
    const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
    const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: user?.id ?? null,
        email: data.email,
        name: data.name,
        phone: data.phone ?? null,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode,
        subtotal,
        discount,
        promoCode,
        shipping,
        tax,
        total,
        paymentMethod: data.paymentMethod,
        notes: data.notes ?? null,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image ?? null,
          })),
        },
      },
    });

    if (promoCode) await incrementPromoUses(promoCode);

    return NextResponse.json(
      {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
        },
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la commande." },
      { status: 500 }
    );
  }
}
