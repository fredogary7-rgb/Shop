"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/lib/auth";

const NAV = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/products" },
  { label: "Homme", href: "/products?category=homme" },
  { label: "Femme", href: "/products?category=femme" },
  { label: "Accessoires", href: "/products?category=accessoires" },
];

export function Header({
  user,
  subscriptionActive = true,
}: {
  user: CurrentUser | null;
  subscriptionActive?: boolean;
}) {
  const { itemCount, mounted } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-ink px-4 py-2 text-center text-[11px] font-medium uppercase tracking-widest text-cream/90">
        Livraison offerte dès 80&nbsp;€ — Retours gratuits sous 30 jours
      </div>

      <div className="border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="btn h-10 w-10 border border-ink/10 !rounded-full p-0 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-medium text-ink-muted transition-colors hover:text-ink",
                  isActive(item.href) && "text-ink"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-gold-400" />
                )}
              </Link>
            ))}
            {user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm font-semibold text-gold-600 hover:text-gold-500"
              >
                Administration
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1">
            {user && !subscriptionActive && user.role !== "ADMIN" && (
              <Link
                href="/abonnement"
                className="btn-gold hidden !rounded-full !px-4 !py-2 text-xs sm:inline-flex"
              >
                S&apos;abonner
              </Link>
            )}
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="btn h-10 w-10 !rounded-full p-0 text-ink hover:bg-ink/5"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={user ? "/account" : "/login"}
              className="btn h-10 w-10 !rounded-full p-0 text-ink hover:bg-ink/5"
              aria-label="Mon compte"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/cart"
              className="btn relative h-10 w-10 !rounded-full p-0 text-ink hover:bg-ink/5"
              aria-label="Panier"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-ink">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-ink/10 bg-cream">
            <form
              onSubmit={submitSearch}
              className="shell flex items-center gap-3 py-3"
            >
              <Search className="h-4 w-4 shrink-0 text-ink-subtle" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une catégorie…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary !px-4 !py-1.5 text-xs"
              >
                Rechercher
              </button>
            </form>
          </div>
        )}

        {menuOpen && (
          <div className="border-t border-ink/10 bg-cream lg:hidden">
            <nav className="shell flex flex-col py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-ink/5 py-3 text-sm font-medium text-ink"
                >
                  {item.label}
                </Link>
              ))}
              {user && !subscriptionActive && user.role !== "ADMIN" && (
                <Link
                  href="/abonnement"
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-ink/5 py-3 text-sm font-semibold text-gold-600"
                >
                  S&apos;abonner
                </Link>
              )}
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="border-b border-ink/5 py-3 text-sm font-medium text-ink"
              >
                {user ? "Mon compte" : "Se connecter / S'inscrire"}
              </Link>
              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="py-3 text-sm font-semibold text-gold-600"
                >
                  Administration
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
