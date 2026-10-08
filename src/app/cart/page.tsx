"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice, SHIPPING_FLAT_RATE } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, mounted } = useCart();

  if (!mounted) {
    return <div className="shell py-12" />;
  }

  if (items.length === 0) {
    return (
      <div className="shell py-24">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="heading-lg mt-6">Votre panier est vide</h1>
          <p className="mt-3 text-ink-muted">
            Découvrez notre collection et trouvez la pièce qui vous ressemble.
          </p>
          <Link href="/products" className="btn-primary mt-8 !px-8 !py-3.5 text-sm">
            Découvrir la boutique
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= 80 ? 0 : SHIPPING_FLAT_RATE;
  const remaining = Math.max(0, 80 - subtotal);

  return (
    <div className="shell py-12">
      <h1 className="heading-xl">Votre panier</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-4"
            >
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif text-lg text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {formatPrice(item.price)} / unité
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-ink-subtle transition hover:text-red-500"
                    aria-label="Retirer"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-full border border-ink/15 px-1.5">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold-600"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink hover:text-gold-600"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="font-semibold text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-serif text-xl text-ink">Récapitulatif</h2>

          {remaining > 0 ? (
            <div className="mt-4 rounded-xl bg-cream p-4">
              <p className="text-sm text-ink-muted">
                Plus que{" "}
                <span className="font-semibold text-ink">
                  {formatPrice(remaining)}
                </span>{" "}
                pour la livraison offerte
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-gold-400 transition-all"
                  style={{ width: `${Math.min(100, (subtotal / 80) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-4 rounded-xl bg-gold-400/15 p-4 text-sm font-medium text-gold-700">
              🎉 Livraison offerte !
            </p>
          )}

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Sous-total</dt>
              <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Livraison</dt>
              <dd className="font-medium text-ink">
                {shipping === 0 ? "Offerte" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="font-serif text-xl text-ink">
                {formatPrice(subtotal + shipping)}
              </dd>
            </div>
          </dl>

          <Link href="/checkout" className="btn-primary mt-6 w-full !py-3.5 text-sm">
            Passer commande
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/products"
            className="btn-outline mt-3 w-full !py-3.5 text-sm"
          >
            Continuer mes achats
          </Link>
        </aside>
      </div>
    </div>
  );
}
