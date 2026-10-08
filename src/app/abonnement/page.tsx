import { redirect } from "next/navigation";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/subscription";
import { getPlan } from "@/lib/plans";
import { SubscriptionCheckout } from "@/components/subscription-checkout";

export const metadata = { title: "Abonnement" };

export default async function AbonnementPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const active = await getActiveSubscription(user.id);

  if (active) {
    const plan = getPlan(active.tier);
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-lg text-center">
          <div className="card p-10">
            <BadgeCheck className="mx-auto h-12 w-12 text-gold-500" />
            <p className="eyebrow mt-4">Abonnement actif</p>
            <h1 className="heading-lg mt-2">Plan {plan.name}</h1>
            <p className="mt-3 text-ink-muted">
              Votre abonnement est actif
              {active.endDate
                ? ` jusqu'au ${active.endDate.toLocaleDateString("fr-FR")}.`
                : "."}
            </p>
            <Link
              href="/account"
              className="btn-primary mt-8 !px-8 !py-3.5 text-sm"
            >
              Accéder à mon compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <SubscriptionCheckout />
    </div>
  );
}
