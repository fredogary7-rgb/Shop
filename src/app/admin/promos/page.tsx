import { prisma } from "@/lib/prisma";
import { PromoForm } from "@/components/promo-form";
import { DeletePromoButton } from "@/components/delete-promo-button";

export const metadata = { title: "Codes promo — Admin" };

export default async function AdminPromosPage() {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="heading-lg">Codes promo</h1>
      <p className="mt-2 text-ink-muted">
        Créez des codes de réduction pour vos clients.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <PromoForm />

        <div className="space-y-4 lg:col-span-2">
          {promos.length === 0 ? (
            <div className="card py-16 text-center text-ink-muted">
              Aucun code promo pour le moment.
            </div>
          ) : (
            promos.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5"
              >
                <div className="flex-1">
                  <p className="font-serif text-lg text-ink">{p.code}</p>
                  <p className="text-sm text-ink-muted">
                    {p.type === "PERCENTAGE"
                      ? `${Number(p.value)}% de réduction`
                      : `-${Number(p.value)} FCFA`}
                    {p.minAmount
                      ? ` · dès ${Number(p.minAmount)} FCFA`
                      : ""}
                    {p.maxUses ? ` · ${p.uses}/${p.maxUses} utilisations` : ` · ${p.uses} utilisations`}
                  </p>
                  {p.expiresAt && (
                    <p className="text-xs text-ink-subtle">
                      Expire le {p.expiresAt.toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    p.active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {p.active ? "Actif" : "Inactif"}
                </span>
                <DeletePromoButton id={p.id} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
