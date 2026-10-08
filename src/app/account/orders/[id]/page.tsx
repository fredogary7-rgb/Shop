import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { OrderTimeline } from "@/components/order-timeline";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: user.id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="shell py-12">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à mon compte
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Détail de la commande</p>
          <h1 className="heading-lg mt-2">{order.orderNumber}</h1>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        Passée le{" "}
        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="mt-6">
        <OrderTimeline status={order.status} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-ink/10 bg-white p-4"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {formatPrice(Number(item.price))} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-ink">
                  {formatPrice(Number(item.price) * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit space-y-6">
          <div className="card p-6">
            <h2 className="font-serif text-lg text-ink">Adresse de livraison</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {order.name}
              <br />
              {order.address}
              <br />
              {order.postalCode} {order.city}, {order.country}
              {order.phone && (
                <>
                  <br />
                  {order.phone}
                </>
              )}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-serif text-lg text-ink">Récapitulatif</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Sous-total</dt>
                <dd className="font-medium">{formatPrice(Number(order.subtotal))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">Livraison</dt>
                <dd className="font-medium">
                  {Number(order.shipping) === 0
                    ? "Offerte"
                    : formatPrice(Number(order.shipping))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">TVA</dt>
                <dd className="font-medium">{formatPrice(Number(order.tax))}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-serif text-lg text-ink">
                  {formatPrice(Number(order.total))}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
