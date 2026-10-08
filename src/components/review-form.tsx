"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useToast } from "@/context/toast-context";

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast("Veuillez choisir une note.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, title, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Une erreur est survenue.");
      toast("Merci pour votre avis !");
      setRating(0);
      setTitle("");
      setComment("");
      router.refresh();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Une erreur est survenue.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h3 className="font-serif text-lg text-ink">Laisser un avis</h3>

      <div>
        <label className="label">Votre note</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5"
              aria-label={`${i} étoiles`}
            >
              <Star
                className={`h-6 w-6 transition ${
                  i <= (hover || rating)
                    ? "fill-gold-400 text-gold-400"
                    : "text-ink-subtle"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Titre (optionnel)</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          placeholder="Résumez votre expérience"
        />
      </div>

      <div>
        <label className="label">Commentaire</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="input resize-none"
          placeholder="Partagez votre expérience avec ce produit…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary !px-6 !py-3 text-sm disabled:opacity-60"
      >
        {loading ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}
