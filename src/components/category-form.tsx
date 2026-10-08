"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/app/actions/admin";
import { useToast } from "@/context/toast-context";

export function CategoryForm() {
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createCategory(form);
      if (res.ok) {
        toast("Catégorie créée !");
        setForm({ name: "", description: "", image: "" });
        router.refresh();
      } else {
        toast(res.error, "error");
      }
    });
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="font-serif text-xl text-ink">Ajouter une catégorie</h2>
      <div>
        <label className="label">Nom *</label>
        <input required value={form.name} onChange={update("name")} className="input" />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={update("description")}
          className="input resize-none"
        />
      </div>
      <div>
        <label className="label">Image (URL)</label>
        <input
          value={form.image}
          onChange={update("image")}
          className="input"
          placeholder="https://…"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full !py-3 text-sm disabled:opacity-60"
      >
        {pending ? "Création…" : "Créer la catégorie"}
      </button>
    </form>
  );
}
