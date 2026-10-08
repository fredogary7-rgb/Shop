import Link from "next/link";
import { Package, ShoppingCart, Users, Euro, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

export const metadata = { title: "Administration" };

export default async function AdminDashboardPage() {
  const [productCount, orderCount, customerCount, orders, revenueAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { items: true },
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);

  const stats = [
    { label: "Chiffre d'affaires", value: formatPrice(revenue), Icon: Euro },
    { label: "Commandes", value: String(orderCount), Icon: ShoppingCart },
    { label: "Produits", value: String(productCount), Icon: Package },
    { label: "Clients", value: String(customerCount), Icon: Users },
  ];

  return (
    <div>
      <h1 className="heading-lg">Tableau de bord</h1>
      <p className="mt-2 text-ink-muted">
        Vue d&apos;ensemble de votre boutique Moretti.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-serif text-2xl text-ink">{value}</p>
            <p className="text-sm text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-ink">Commandes récentes</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gold-600 hover:text-gold-500"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="card py-16 text-center text-ink-muted">
            Aucune commande pour le moment.
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-6 py-3">Commande</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="bg-white">
                    <td className="px-6 py-4 font-medium text-ink">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{o.name}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-ink">
                      {formatPrice(Number(o.total))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
