import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/subscription";
import { formatPrice } from "@/lib/utils";
import { RemoveWishlistButton } from "@/components/remove-wishlist-button";

export const metadata = { title: "Mes favoris" };

export default async function FavorisPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const subscription = await getActiveSubscription(user.id);
  if (!subscription && user.role !== "ADMIN") redirect("/abonnement");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="shell py-12">
      <p className="eyebrow">Favoris</p>
      <h1 className="heading-lg mt-2">Ma liste de souhaits</h1>
      <p className="mt-2 text-ink-muted">
        {items.length} produit{items.length > 1 ? "s" : ""} enregistré
        {items.length > 1 ? "s" : ""}.
      </p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <Heart className="mx-auto h-10 w-10 text-ink-subtle" />
          <p className="mt-3 text-ink">Aucun favori pour le moment</p>
          <Link
            href="/products"
            className="btn-primary mt-5 !px-6 !py-2.5 text-sm"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.id}>
              <Link href={`/products/${it.product.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dark">
                  {it.product.images[0] && (
                    <Image
                      src={it.product.images[0]}
                      alt={it.product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
              </Link>
              <div className="mt-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">
                  {it.product.category?.name}
                </p>
                <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
                  {it.product.title}
                </h3>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(Number(it.product.price))}
                  </span>
                  <RemoveWishlistButton productId={it.productId} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
