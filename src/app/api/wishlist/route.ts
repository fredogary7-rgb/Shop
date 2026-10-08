import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ items: [] });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    items: items.map((i) => ({
      productId: i.productId,
      product: {
        slug: i.product.slug,
        title: i.product.title,
        price: Number(i.product.price),
        compareAtPrice: i.product.compareAtPrice
          ? Number(i.product.compareAtPrice)
          : null,
        images: i.product.images,
        category: i.product.category
          ? { name: i.product.category.name, slug: i.product.category.slug }
          : null,
      },
    })),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connectez-vous." }, { status: 401 });
  }

  const { productId } = await req.json();
  if (!productId) {
    return NextResponse.json({ error: "productId requis." }, { status: 400 });
  }

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    return NextResponse.json({ added: false });
  }

  await prisma.wishlistItem.create({
    data: { userId: user.id, productId },
  });
  return NextResponse.json({ added: true });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Connectez-vous." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId requis." }, { status: 400 });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId: user.id, productId },
  });
  return NextResponse.json({ ok: true });
}
