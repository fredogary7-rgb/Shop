import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Boutique",
    links: [
      { label: "Tous les produits", href: "/products" },
      { label: "Homme", href: "/products?category=homme" },
      { label: "Femme", href: "/products?category=femme" },
      { label: "Accessoires", href: "/products?category=accessoires" },
      { label: "Maroquinerie", href: "/products?category=maroquinerie" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Mon compte", href: "/account" },
      { label: "Mes commandes", href: "/account" },
      { label: "Livraison & retours", href: "/#livraison" },
      { label: "Nous contacter", href: "/#contact" },
      { label: "Administration", href: "/admin" },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    d: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4m5.2-8.3a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0",
  },
  {
    label: "Facebook",
    href: "#",
    d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "X",
    href: "#",
    d: "M18 6 6 18 M6 6l12 12",
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream/80">
      <div className="border-b border-cream/10">
        <div className="shell flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-2xl text-cream">Restez inspiré</h3>
            <p className="mt-1 text-sm text-cream/60">
              Recevez nos nouveautés et offres exclusives en avant-première.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            L&apos;élégance à l&apos;italienne. Des pièces intemporelles,
            fabriquées avec soin pour durer toute une vie.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ label, href, d }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition hover:border-gold-400 hover:text-gold-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d={d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-cream">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 transition hover:text-gold-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-cream">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/60">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
              <span>12 Via Monte Napoleone, 20121 Milan, Italie</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" />
              <a href="mailto:contact@moretti.shop" className="hover:text-gold-300">
                contact@moretti.shop
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" />
              <a href="tel:+390212345678" className="hover:text-gold-300">
                +39 02 123 456 78
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Moretti Shop. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-cream/80">
              Mentions légales
            </Link>
            <Link href="#" className="hover:text-cream/80">
              CGV
            </Link>
            <Link href="#" className="hover:text-cream/80">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
