import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

const valueProps = [
  { Icon: Truck, title: "Livraison offerte", text: "Dès 80 € d'achat, partout en France." },
  { Icon: RotateCcw, title: "Retours gratuits", text: "30 jours pour changer d'avis." },
  { Icon: ShieldCheck, title: "Paiement sécurisé", text: "Transactions chiffrées et protégées." },
  { Icon: Headphones, title: "Service client 7j/7", text: "Une équipe dédiée à votre écoute." },
];

const testimonials = [
  {
    quote:
      "Une qualité de fabrication exceptionnelle. Mon sac Moretti est devenu mon indispensable.",
    name: "Camille R.",
    role: "Cliente fidèle",
  },
  {
    quote:
      "La montre est encore plus belle en vrai. Livraison rapide et emballage soigné.",
    name: "Thomas L.",
    role: "Client vérifié",
  },
  {
    quote:
      "Enfin une boutique qui allie élégance et service impeccable. Je recommande vivement.",
    name: "Sofia M.",
    role: "Cliente vérifiée",
  },
];

export default async function Home() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, status: "ACTIVE" },
      take: 8,
      include: { category: true },
    }),
    prisma.category.findMany({
      take: 6,
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const products = featured.map((p) => ({
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images,
    category: { name: p.category.name, slug: p.category.slug },
  }));

  return (
    <div>
      {/* HERO */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format&fit=crop"
          alt="Collection Moretti"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="shell relative py-24">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fade-up text-gold-300">
              Collection Automne-Hiver 2026
            </p>
            <h1 className="heading-xl mt-4 animate-fade-up text-cream">
              L&apos;élégance
              <br />
              <span className="text-gold-300">à l&apos;italienne.</span>
            </h1>
            <p className="mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-cream/80 sm:text-lg">
              Découvrez des pièces intemporelles, conçues avec soin par la
              maison Moretti. Mode, maroquinerie et accessoires d&apos;exception.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-up">
              <Link href="/products" className="btn-gold !px-8 !py-3.5 text-sm">
                Découvrir la boutique
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?category=accessoires"
                className="btn-outline-light !px-8 !py-3.5 text-sm"
              >
                Voir les accessoires
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="border-b border-ink/10 bg-cream">
        <div className="shell grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {valueProps.map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mt-0.5 text-sm text-ink-muted">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="shell py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="eyebrow">Nos univers</p>
            <h2 className="heading-lg mt-2">Explorer par catégorie</h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1.5 text-sm font-medium text-ink hover:text-gold-600 sm:inline-flex"
          >
            Tout voir <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="h-full w-full bg-cream-dark" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-serif text-lg text-cream">{c.name}</h3>
                <p className="text-xs text-cream/70">
                  {c._count.products} produits
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-white py-20">
        <div className="shell">
          <div className="mb-10 text-center">
            <p className="eyebrow">Sélection</p>
            <h2 className="heading-lg mt-2">Nos produits vedettes</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">
              Les pièces préférées de nos clients, choisies pour leur style et
              leur qualité.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products" className="btn-primary !px-8 !py-3.5 text-sm">
              Voir toute la collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="shell py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80&auto=format&fit=crop"
              alt="Atelier Moretti"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">La maison Moretti</p>
            <h2 className="heading-lg mt-2">Un savoir-faire transmis depuis 1972</h2>
            <p className="mt-5 text-ink-muted leading-relaxed">
              Née à Milan, la maison Moretti perpétue l&apos;art du beau à
              l&apos;italienne. Chaque pièce est imaginée, dessinée et
              confectionnée avec des matières nobles et une exigence de
              perfection.
            </p>
            <p className="mt-4 text-ink-muted leading-relaxed">
              Du cuir pleine fleur tanné végétal aux tissus les plus rares, nous
              sélectionnons chaque matériau pour sa beauté et sa durabilité.
            </p>
            <div className="mt-8 flex gap-12">
              <div>
                <p className="font-serif text-3xl text-ink">50+</p>
                <p className="text-sm text-ink-muted">Années d&apos;expérience</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-ink">120k</p>
                <p className="text-sm text-ink-muted">Clients satisfaits</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-ink">4.9/5</p>
                <p className="text-sm text-ink-muted">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ink py-20 text-cream">
        <div className="shell">
          <div className="mb-12 text-center">
            <p className="eyebrow text-gold-300">Ils nous font confiance</p>
            <h2 className="heading-lg mt-2 text-cream">Ce que disent nos clients</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-cream/10 bg-white/5 p-8">
                <div className="mb-4 flex gap-1 text-gold-300">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <p className="leading-relaxed text-cream/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-6 font-serif text-lg text-cream">{t.name}</p>
                <p className="text-sm text-cream/50">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
