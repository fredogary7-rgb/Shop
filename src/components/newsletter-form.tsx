"use client";

import { useState } from "react";
import { useToast } from "@/context/toast-context";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast("Merci ! Vous êtes inscrit à la newsletter.");
      setEmail("");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Une erreur est survenue", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        className="w-full rounded-full border border-cream/20 bg-white/10 px-5 py-3 text-sm text-cream placeholder:text-cream/60 focus:border-gold-400 focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="btn-gold shrink-0 !px-6 text-sm disabled:opacity-60"
      >
        {loading ? "Envoi…" : "S'inscrire"}
      </button>
    </form>
  );
}
