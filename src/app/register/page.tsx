"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useToast } from "@/context/toast-context";
import { Logo } from "@/components/logo";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password.length < 8) {
      toast("Le mot de passe doit contenir au moins 8 caractères.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      toast("Compte créé avec succès !");
      router.push("/account");
      router.refresh();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Une erreur est survenue.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(176,141,87,0.25),transparent_50%)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Logo light />
          <div>
            <p className="eyebrow text-gold-300">Rejoignez la maison</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-cream">
              Créez votre compte Moretti.
            </h2>
            <p className="mt-4 max-w-sm text-cream/70">
              Bénéficiez d&apos;un suivi de commandes, d&apos;offres exclusives
              et d&apos;un paiement accéléré.
            </p>
          </div>
          <p className="text-sm text-cream/50">
            © {new Date().getFullYear()} Moretti Shop
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="heading-lg">Créer un compte</h1>
          <p className="mt-2 text-ink-muted">
            Rejoignez Moretti Shop en quelques secondes.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label" htmlFor="name">
                Nom complet
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  id="name"
                  required
                  value={form.name}
                  onChange={update("name")}
                  className="input !pl-10"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  className="input !pl-10"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={update("password")}
                  className="input !pl-10 !pr-11"
                  placeholder="8 caractères minimum"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink"
                  aria-label="Afficher le mot de passe"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3.5 text-sm disabled:opacity-60"
            >
              {loading ? "Création…" : "Créer mon compte"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-medium text-gold-600 hover:text-gold-500">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
