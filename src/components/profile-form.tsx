"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/account";
import { useToast } from "@/context/toast-context";

export function ProfileForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    postalCode: string | null;
  };
}) {
  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone ?? "",
    address: user.address ?? "",
    city: user.city ?? "",
    country: user.country ?? "",
    postalCode: user.postalCode ?? "",
  });
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateProfile(form);
      if (res.ok) toast("Profil mis à jour !");
      else toast(res.error, "error");
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className="label">Email</label>
        <input value={user.email} disabled className="input opacity-60" />
      </div>
      <div>
        <label className="label">Nom complet</label>
        <input
          value={form.name}
          onChange={update("name")}
          className="input"
          required
        />
      </div>
      <div>
        <label className="label">Téléphone</label>
        <input
          value={form.phone}
          onChange={update("phone")}
          className="input"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="label">Adresse</label>
        <input
          value={form.address}
          onChange={update("address")}
          className="input"
        />
      </div>
      <div>
        <label className="label">Ville</label>
        <input value={form.city} onChange={update("city")} className="input" />
      </div>
      <div>
        <label className="label">Code postal</label>
        <input
          value={form.postalCode}
          onChange={update("postalCode")}
          className="input"
        />
      </div>
      <div>
        <label className="label">Pays</label>
        <input
          value={form.country}
          onChange={update("country")}
          className="input"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary !px-8 !py-3 text-sm disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
