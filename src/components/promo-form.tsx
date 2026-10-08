"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createPromoCode } from "@/app/actions/admin";
import { useToast } from "@/context/toast-context";

const empty = {
  code: "",
  type: "PERCENTAGE",
  value: "",
  minAmount: "",
  maxUses: "",
  expiresAt: "",
};

export function PromoForm() {
  const [form, setForm] = useState(empty);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createPromoCode(form);
      if (res.ok) {
        toast("Code promo créé !");
        setForm(empty);
        router.refresh();
      } else {
        toast(res.error, "error");
      }
    });
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="font-serif text-xl text-ink">Créer un code promo</h2>

      <div>
        <label className="label">Code *</label>
        <input
          required
          value={form.code}
          onChange={update("code")}
          className="input uppercase"
          placeholder="BIENVENUE10"
        />
      </div>

      <div>
        <label className="label">Type</label>
        <select value={form.type} onChange={update("type")} className="input">
          <option value="PERCENTAGE">Pourcentage (%)</option>
          <option value="FIXED">Montant fixe (FCFA)</option>
        </select>
      </div>

      <div>
        <label className="label">Valeur *</label>
        <input
          required
          type="number"
          step="0.01"
          min="0"
          value={form.value}
          onChange={update("value")}
          className="input"
          placeholder={form.type === "PERCENTAGE" ? "10" : "2000"}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Montant min.</label>
          <input
            type="number"
            min="0"
            value={form.minAmount}
            onChange={update("minAmount")}
            className="input"
            placeholder="Optionnel"
          />
        </div>
        <div>
          <label className="label">Utilisations max.</label>
          <input
            type="number"
            min="0"
            value={form.maxUses}
            onChange={update("maxUses")}
            className="input"
            placeholder="Illimité"
          />
        </div>
      </div>

      <div>
        <label className="label">Expire le (optionnel)</label>
        <input
          type="date"
          value={form.expiresAt}
          onChange={update("expiresAt")}
          className="input"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer le code"}
      </button>
    </form>
  );
}
