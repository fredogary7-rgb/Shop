"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Smartphone, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { PLANS, formatFCFA } from "@/lib/plans";
import { SOLEASPAY_COUNTRIES } from "@/lib/soleaspay";
import { PayPalButton } from "./paypal-button";
import { useToast } from "@/context/toast-context";
import { cn } from "@/lib/utils";

export function SubscriptionCheckout() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [method, setMethod] = useState<"mobile" | "paypal">("mobile");
  const [countryCode, setCountryCode] = useState("CM");
  const [serviceId, setServiceId] = useState(1);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [paypalStarted, setPaypalStarted] = useState(false);

  const plan = PLANS.find((p) => p.id === selectedPlan) ?? null;
  const country = SOLEASPAY_COUNTRIES.find((c) => c.code === countryCode);

  useEffect(() => {
    if (!orderId) return;
    setPolling(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/subscription/status?orderId=${orderId}`);
        const data = await res.json();
        if (data.status === "ACTIVE") {
          clearInterval(interval);
          setPolling(false);
          setOrderId(null);
          setDone(true);
          toast("Abonnement activé !");
          router.refresh();
        } else if (data.status === "CANCELLED") {
          clearInterval(interval);
          setPolling(false);
          setOrderId(null);
          setError("Paiement annulé ou échoué. Réessayez.");
        }
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId, router, toast]);

  const handleMobilePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/soleaspay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: selectedPlan,
          countryCode,
          serviceId,
          phone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      setOrderId(data.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCountry = (code: string) => {
    setCountryCode(code);
    const c = SOLEASPAY_COUNTRIES.find((x) => x.code === code);
    setServiceId(c?.services[0]?.id ?? 1);
  };

  const startPaypal = async () => {
    if (!selectedPlan || paypalStarted) return;
    try {
      const res = await fetch("/api/subscription/paypal/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: selectedPlan }),
      });
      if (res.ok) setPaypalStarted(true);
    } catch {
      // ignore
    }
  };

  if (done && plan) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="card p-10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400 text-ink">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="heading-lg mt-6">Abonnement activé !</h1>
          <p className="mt-3 text-ink-muted">
            Votre forfait <span className="font-semibold text-ink">{plan.name}</span> est
            maintenant actif. Bienvenue chez Moretti Shop.
          </p>
          <a href="/account" className="btn-primary mt-8 !px-8 !py-3.5 text-sm">
            Accéder à mon compte
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Abonnement</p>
        <h1 className="heading-xl mt-3">Choisissez votre forfait</h1>
        <p className="mt-4 text-ink-muted">
          Comme Shopify, chaque plan débloque des fonctionnalités adaptées à
          votre activité. Changez de plan à tout moment.
        </p>
      </div>

      <div className="mt-12 flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={cn(
              "relative flex w-[280px] shrink-0 flex-col rounded-2xl border bg-white p-6 transition sm:w-[320px] lg:w-auto lg:p-8",
              p.highlight
                ? "border-gold-400 shadow-gold"
                : "border-ink/10 shadow-card"
            )}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gold-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-ink">
                Populaire
              </span>
            )}
            <h2 className="font-serif text-2xl text-ink">{p.name}</h2>
            <p className="mt-1 text-sm text-ink-muted">{p.tagline}</p>
            <p className="mt-5">
              <span className="font-serif text-4xl text-ink">
                {formatFCFA(p.priceFCFA)}
              </span>
              <span className="ml-1 text-sm text-ink-muted">
                / {p.durationDays >= 365 ? "an" : "mois"}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-sm text-ink-muted"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                setSelectedPlan(p.id);
                setPaypalStarted(false);
                setError("");
              }}
              className={cn(
                "mt-8 w-full text-sm",
                p.highlight ? "btn-gold !py-3.5" : "btn-outline !py-3.5"
              )}
            >
              Choisir {p.name}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && plan && (
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="card p-8">
            <h2 className="font-serif text-2xl text-ink">
              Finaliser votre abonnement
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Forfait <span className="font-medium text-ink">{plan.name}</span> —{" "}
              {formatFCFA(plan.priceFCFA)} / {plan.durationDays >= 365 ? "an" : "mois"}
            </p>

            {polling ? (
              <div className="mt-8 rounded-2xl bg-cream p-8 text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-gold-600" />
                <p className="mt-4 font-semibold text-ink">Paiement en cours…</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Validez le paiement sur votre téléphone (code PIN Mobile Money).
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMethod("mobile")}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition",
                      method === "mobile"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 bg-white text-ink hover:border-ink"
                    )}
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMethod("paypal");
                      startPaypal();
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition",
                      method === "paypal"
                        ? "border-ink bg-ink text-cream"
                        : "border-ink/15 bg-white text-ink hover:border-ink"
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    PayPal
                  </button>
                </div>

                {method === "mobile" ? (
                  <form onSubmit={handleMobilePay} className="mt-6 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label">Pays</label>
                        <select
                          value={countryCode}
                          onChange={(e) => handleSelectCountry(e.target.value)}
                          className="input"
                        >
                          {SOLEASPAY_COUNTRIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="label">Opérateur</label>
                        <select
                          value={serviceId}
                          onChange={(e) => setServiceId(Number(e.target.value))}
                          className="input"
                        >
                          {country?.services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="label">Numéro Mobile Money</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input"
                        placeholder="Ex : 690000001"
                        required
                      />
                    </div>

                    {error && (
                      <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold w-full !py-3.5 text-sm disabled:opacity-60"
                    >
                      {loading ? "Envoi…" : `Payer ${formatFCFA(plan.priceFCFA)}`}
                    </button>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Paiement sécurisé via Soleaspay
                    </p>
                  </form>
                ) : (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm text-ink-muted">
                      Cliquez sur le bouton PayPal ci-dessous pour finaliser
                      votre paiement.
                    </p>
                    <PayPalButton
                      onSuccess={() => {
                        setDone(true);
                        router.refresh();
                      }}
                    />
                    <p className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Paiement sécurisé via PayPal
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
