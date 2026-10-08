import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, ChevronRight, LogOut, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/subscription";
import { getPlan } from "@/lib/plans";
import { formatPrice } from "@/lib/utils";
import { ProfileForm } from "@/components/profile-form";
import { StatusBadge } from "@/components/status-badge";

export const metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const subscription = await getActiveSubscription(user.id);
  if (!subscription && user.role !== "ADMIN") redirect("/abonnement");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Mon compte</p>
          <h1 className="heading-lg mt-2">Bonjour, {user.name.split(" ")[0]}</h1>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn-outline !px-5 !py-2.5 text-sm">
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </form>
      </div>

      {subscription && (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold-400/40 bg-gold-400/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-6 w-6 text-gold-600" />
            <div>
              <p className="font-semibold text-ink">
                Abonnement {getPlan(subscription.tier).name} actif
              </p>
              <p className="text-sm text-ink-muted">
                {subscription.endDate
                  ? `Expire le ${subscription.endDate.toLocaleDateString("fr-FR")}`
                  : "Actif"}
              </p>
            </div>
          </div>
          <Link
            href="/abonnement"
            className="btn-outline !px-5 !py-2.5 text-sm"
          >
            Gérer mon abonnement
          </Link>
        </div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-1">
          <h2 className="font-serif text-xl text-ink">Mes informations</h2>
          <div className="mt-5">
            <ProfileForm user={user} />
          </div>
        </section>

        <section className="lg:col-span-2">
          <h2 className="font-serif text-xl text-ink">Mes commandes</h2>

          {orders.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-ink/15 bg-white py-16 text-center">
              <Package className="mx-auto h-10 w-10 text-ink-subtle" />
              <p className="mt-3 text-ink">Aucune commande pour le moment</p>
              <Link href="/products" className="btn-primary mt-5 !px-6 !py-2.5 text-sm">
                Commencer mes achats
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-5 transition hover:shadow-cardHover"
                >
                  <div>
                    <p className="font-semibold text-ink">
                      Commande {order.orderNumber}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-semibold text-ink">
                      {formatPrice(Number(order.total))}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-subtle" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
