export type PlanTier = "STARTER" | "PRO" | "PREMIUM";

export type Plan = {
  id: PlanTier;
  name: string;
  tagline: string;
  priceFCFA: number;
  priceLabel: string;
  durationDays: number;
  features: string[];
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "STARTER",
    name: "Starter",
    tagline: "Pour lancer votre boutique",
    priceFCFA: 2000,
    priceLabel: "2 000 FCFA / mois",
    durationDays: 30,
    features: [
      "Accès à la boutique en ligne",
      "Catalogue jusqu'à 50 produits",
      "1 compte administrateur",
      "Paiements Mobile Money & PayPal",
      "Support par email",
    ],
  },
  {
    id: "PRO",
    name: "Pro",
    tagline: "Pour développer votre activité",
    priceFCFA: 5000,
    priceLabel: "5 000 FCFA / mois",
    durationDays: 30,
    features: [
      "Tout le plan Starter",
      "Catalogue illimité",
      "5 comptes administrateurs",
      "Statistiques & rapports avancés",
      "Codes de réduction",
      "Support prioritaire",
    ],
    highlight: true,
  },
  {
    id: "PREMIUM",
    name: "Premium",
    tagline: "L'expérience ultime (2 mois offerts)",
    priceFCFA: 50000,
    priceLabel: "50 000 FCFA / an",
    durationDays: 365,
    features: [
      "Tout le plan Pro",
      "10 comptes administrateurs",
      "Accès anticipé aux nouveautés",
      "Support dédié 24/7",
      "Réductions exclusives",
      "Personnalisation avancée",
    ],
  },
];

export function getPlan(tier: string): Plan {
  return PLANS.find((p) => p.id === tier) ?? PLANS[0];
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}
