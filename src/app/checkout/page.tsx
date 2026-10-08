"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Lock, Tag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatPrice, SHIPPING_FLAT_RATE, TAX_RATE } from "@/lib/utils";

const initialForm = {
  email: "",
  name: "",
  phone: "",
  address: "",
  city: "",
  country: "France",
  postalCode: "",
  paymentMethod: "card",
  notes: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart, mounted } = useCart();
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ orderNumber: string } | null>(null);
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(
    null
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem("moretti_promo");
      if (stored) setPromo(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  if (!mounted) {
    return <div className="shell py-12" />;
  }

  if (success) {
    return (
      <div className="shell py-24">
        <div className="mx-auto max-w-lg text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="heading-lg mt-6">Merci pour votre commande !</h1>
          <p className="mt-3 text-ink-muted">
            Votre commande{" "}
            <span className="font-semibold text-ink">{success.orderNumber}</span>{" "}
            a bien été enregistrée. Un email de confirmation vous a été envoyé.
          </p>
          <Link href="/products" className="btn-primary mt-8 !px-8 !py-3.5 text-sm">
            Continuer mes achats
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="heading-lg">Votre panier est vide</h1>
        <p className="mt-3 text-ink-muted">
          Ajoutez des produits avant de passer commande.
        </p>
        <Link href="/products" className="btn-primary mt-8 !px-8 !py-3.5 text-sm">
          Voir la boutique
        </Link>
      </div>
    );
  }

  const discount = promo?.discount ?? 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = discountedSubtotal >= 80 ? 0 : SHIPPING_FLAT_RATE;
  const tax = Math.round(discountedSubtotal * TAX_RATE * 100) / 100;
  const total = Math.round((discountedSubtotal + shipping + tax) * 100) / 100;

  const update =
    (key: keyof typeof initialForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          promoCode: promo?.code ?? null,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      clearCart();
      localStorage.removeItem("moretti_promo");
      setSuccess({ orderNumber: data.order.orderNumber });
      window.scrollTo({ top: 0 });
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Une erreur est survenue.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shell py-12">
      <h1 className="heading-xl">Finaliser la commande</h1>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Contact */}
          <section className="card p-6">
            <h2 className="font-serif text-xl text-ink">1. Contact</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  className="input"
                  placeholder="vous@exemple.com"
                />
              </div>
              <div>
                <label className="label" htmlFor="name">
                  Nom complet *
                </label>
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  className="input"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>
          </section>

          {/* Livraison */}
          <section className="card p-6">
            <h2 className="font-serif text-xl text-ink">2. Livraison</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="address">
                  Adresse *
                </label>
                <input
                  id="address"
                  required
                  value={form.address}
                  onChange={update("address")}
                  className="input"
                  placeholder="12 rue de la Paix"
                />
              </div>
              <div>
                <label className="label" htmlFor="city">
                  Ville *
                </label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={update("city")}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="postalCode">
                  Code postal *
                </label>
                <input
                  id="postalCode"
                  required
                  value={form.postalCode}
                  onChange={update("postalCode")}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="country">
                  Pays *
                </label>
                <input
                  id="country"
                  required
                  value={form.country}
                  onChange={update("country")}
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="phone">
                  Téléphone
                </label>
                <input
                  id="phone"
                  value={form.phone}
                  onChange={update("phone")}
                  className="input"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>
          </section>

          {/* Paiement */}
          <section className="card p-6">
            <h2 className="font-serif text-xl text-ink">3. Paiement</h2>
            <div className="mt-4 space-y-3">
              {[
                { value: "card", label: "Carte bancaire", hint: "Visa, Mastercard, Amex" },
                { value: "paypal", label: "PayPal", hint: "Paiement sécurisé" },
                { value: "transfer", label: "Virement bancaire", hint: "Sous 24h" },
              ].map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    form.paymentMethod === m.value
                      ? "border-gold-400 bg-gold-400/10"
                      : "border-ink/10 bg-white hover:border-ink/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={form.paymentMethod === m.value}
                    onChange={update("paymentMethod")}
                    className="accent-gold-500"
                  />
                  <span className="flex-1">
                    <span className="block font-medium text-ink">{m.label}</span>
                    <span className="text-sm text-ink-muted">{m.hint}</span>
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-5">
              <label className="label" htmlFor="notes">
                Notes de commande (optionnel)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={update("notes")}
                className="input resize-none"
                placeholder="Instructions particulières…"
              />
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 bg-white p-6">
          <h2 className="font-serif text-xl text-ink">Votre commande</h2>

          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-muted">Qté : {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-ink">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Sous-total</dt>
              <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
            </div>
            {promo && (
              <div className="flex items-center justify-between text-gold-700">
                <dt className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {promo.code}
                </dt>
                <dd className="font-medium">-{formatPrice(discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-muted">Livraison</dt>
              <dd className="font-medium text-ink">
                {shipping === 0 ? "Offerte" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">TVA (20%)</dt>
              <dd className="font-medium text-ink">{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3">
              <dt className="font-semibold text-ink">Total TTC</dt>
              <dd className="font-serif text-xl text-ink">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full !py-3.5 text-sm disabled:opacity-60"
          >
            {loading ? "Traitement…" : "Payer la commande"}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-ink-muted">
            <Lock className="h-3.5 w-3.5" />
            Paiement 100% sécurisé et chiffré
          </p>
        </aside>
      </form>
    </div>
  );
}
