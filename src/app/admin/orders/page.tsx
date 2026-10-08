import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";
import { OrderStatusSelect } from "@/components/order-status-select";

export const metadata = { title: "Commandes — Admin" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 className="heading-lg">Commandes</h1>
      <p className="mt-2 text-ink-muted">
        {orders.length} commande{orders.length > 1 ? "s" : ""} au total.
      </p>

      {orders.length === 0 ? (
        <div className="card mt-8 py-16 text-center text-ink-muted">
          Aucune commande pour le moment.
        </div>
      ) : (
        <div className="card mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-6 py-3">Commande</th>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="bg-white">
                    <td className="px-6 py-4 font-medium text-ink">
                      {o.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{o.name}</td>
                    <td className="px-6 py-4 text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 font-semibold text-ink">
                      {formatPrice(Number(o.total))}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={o.status} />
                        <OrderStatusSelect id={o.id} status={o.status} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
