import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Clients — Admin" };

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { orders: true },
  });

  return (
    <div>
      <h1 className="heading-lg">Clients</h1>
      <p className="mt-2 text-ink-muted">
        {customers.length} client{customers.length > 1 ? "s" : ""} inscrit
        {customers.length > 1 ? "s" : ""}.
      </p>

      {customers.length === 0 ? (
        <div className="card mt-8 py-16 text-center text-ink-muted">
          Aucun client pour le moment.
        </div>
      ) : (
        <div className="card mt-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Commandes</th>
                  <th className="px-6 py-3 text-right">Total dépensé</th>
                  <th className="px-6 py-3">Inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {customers.map((c) => {
                  const spent = c.orders.reduce(
                    (acc, o) => acc + Number(o.total),
                    0
                  );
                  return (
                    <tr key={c.id} className="bg-white">
                      <td className="px-6 py-4 font-medium text-ink">{c.name}</td>
                      <td className="px-6 py-4 text-ink-muted">{c.email}</td>
                      <td className="px-6 py-4 text-ink-muted">{c.orders.length}</td>
                      <td className="px-6 py-4 text-right font-semibold text-ink">
                        {formatPrice(spent)}
                      </td>
                      <td className="px-6 py-4 text-ink-muted">
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
