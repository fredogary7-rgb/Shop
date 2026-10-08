import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Démarrage du seed Moretti Shop...");

  // Nettoyage (ordre respectant les contraintes)
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Utilisateurs
  const adminPassword = await bcrypt.hash("admin123456", 10);
  const clientPassword = await bcrypt.hash("client123456", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "Administrateur Moretti",
        email: "admin@moretti.shop",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Client Démo",
        email: "client@moretti.shop",
        password: clientPassword,
        role: "CUSTOMER",
        phone: "+33 6 12 34 56 78",
        address: "12 Rue de la Paix",
        city: "Paris",
        country: "France",
        postalCode: "75002",
      },
    ],
  });

  console.log("👤 Utilisateurs créés (admin@moretti.shop / client@moretti.shop)");

  // Catégories
  const categories = await Promise.all(
    [
      {
        name: "Homme",
        slug: "homme",
        description: "Vêtements & accessoires pour homme",
        image:
          "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80&auto=format&fit=crop",
      },
      {
        name: "Femme",
        slug: "femme",
        description: "Collections élégantes pour femme",
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80&auto=format&fit=crop",
      },
      {
        name: "Accessoires",
        slug: "accessoires",
        description: "Les finitions qui font la différence",
        image:
          "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80&auto=format&fit=crop",
      },
      {
        name: "Maroquinerie",
        slug: "maroquinerie",
        description: "Cuir artisanal & savoir-faire italien",
        image:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80&auto=format&fit=crop",
      },
      {
        name: "Chaussures",
        slug: "chaussures",
        description: "Sneakers & chaussures premium",
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop",
      },
      {
        name: "Montres",
        slug: "montres",
        description: "Garde-temps d'exception",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop",
      },
    ].map((c) => prisma.category.create({ data: c }))
  );

  const catByName = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log("🏷️  6 catégories créées");

  const products = [];

  products.push({
    title: "Montre Classique Chrono",
    categoryId: catByName["montres"],
    slug: "montre-classique-chrono",
    description:
      "Garde-temps raffiné au boîtier en acier inoxydable et bracelet en cuir véritable. Un classique intemporel signé Moretti.",
    details:
      "Boîtier 40mm en acier inoxydable. Verre saphir anti-rayures. Mouvement quartz japonais. Étanchéité 5 ATM. Bracelet en cuir italien interchangeable.",
    price: 249.0,
    compareAtPrice: 329.0,
    sku: "MOR-WATCH-001",
    inventory: 42,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  products.push({
    title: "Sac Cuir Artisanal Milano",
    categoryId: catByName["maroquinerie"],
    slug: "sac-cuir-artisanal-milano",
    description:
      "Sac à main en cuir pleine fleur, cousu main dans nos ateliers toscans. L'accessoire signature de la maison Moretti.",
    details:
      "Cuir de veau pleine fleur tanné végétal. Doublure en coton. Fermeture magnétique. Poche intérieure zippée. Dimensions 28 x 20 x 10 cm.",
    price: 389.0,
    compareAtPrice: null,
    sku: "MOR-BAG-002",
    inventory: 18,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  products.push({
    title: "Costume Laine Slim Roma",
    categoryId: catByName["homme"],
    slug: "costume-laine-slim-roma",
    description:
      "Costume deux pièces en laine mérinos, coupe slim. L'élégance italienne au quotidien.",
    details:
      "100% laine mérinos. Coupe slim ajustée. Doublure en viscose. Pantalon à pinces. Nettoyage à sec recommandé.",
    price: 449.0,
    compareAtPrice: 549.0,
    sku: "MOR-SUIT-003",
    inventory: 24,
    images: [
      "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  products.push({
    title: "Robe Soirée Élégante",
    categoryId: catByName["femme"],
    slug: "robe-soiree-elegante",
    description:
      "Robe de soirée fluide au tombé impeccable, pensée pour les grandes occasions.",
    details:
      "Mélange soie et viscose. Coupe évasée. Fermeture invisible. Doublure intégrée. Longueur midi.",
    price: 189.0,
    compareAtPrice: 239.0,
    sku: "MOR-DRESS-004",
    inventory: 31,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  /*__PRODUCTS_A__*/
  products.push({
    title: "Lunettes de Soleil Riviera",
    categoryId: catByName["accessoires"],
    slug: "lunettes-soleil-riviera",
    description:
      "Monture acétate aux verres polarisés, protection UV400. Un style résolument italien.",
    details:
      "Monture en acétate italien. Verres polarisés anti-reflets. Protection UV400. Étui rigide et chiffon inclus.",
    price: 129.0,
    compareAtPrice: null,
    sku: "MOR-SUN-005",
    inventory: 56,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Sneakers Premium Torino",
    categoryId: catByName["chaussures"],
    slug: "sneakers-premium-torino",
    description:
      "Sneakers en cuir blanc au design épuré, confectionnées à la main au Portugal.",
    details:
      "Cuir de veau blanc. Semelle en caoutchouc naturel. Doublure cuir. Chaussant normal. Entretien avec crème incolore.",
    price: 179.0,
    compareAtPrice: 219.0,
    sku: "MOR-SNEAK-006",
    inventory: 37,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  products.push({
    title: "Parfum Essenza d'Oro",
    categoryId: catByName["accessoires"],
    slug: "parfum-essenza-d-oro",
    description:
      "Eau de parfum aux notes boisées et ambrées. Un sillage chaleureux et raffiné.",
    details:
      "Notes de tête : bergamote, safran. Notes de cœur : cèdre, cuir. Notes de fond : ambre, vanille. Flacon 100ml.",
    price: 95.0,
    compareAtPrice: 119.0,
    sku: "MOR-PERF-007",
    inventory: 63,
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Ceinture Cuir Tressé",
    categoryId: catByName["accessoires"],
    slug: "ceinture-cuir-tresse",
    description:
      "Ceinture en cuir tressé à la main, boucle en laiton brossé. Le détail qui change tout.",
    details:
      "Cuir pleine fleur. Boucle en laiton brossé. Largeur 3.5cm. Tailles S à XL.",
    price: 69.0,
    compareAtPrice: null,
    sku: "MOR-BELT-008",
    inventory: 80,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  /*__PRODUCTS_B__*/
  products.push({
    title: "Sac Bandoulière Vintage",
    categoryId: catByName["maroquinerie"],
    slug: "sac-bandouliere-vintage",
    description:
      "Sac bandoulière compact au cuir patiné, idéal pour un usage quotidien élégant.",
    details:
      "Cuir de vachette patiné. Bandoulière ajustable. Poche avant zippée. Intérieur doublé toile.",
    price: 219.0,
    compareAtPrice: 259.0,
    sku: "MOR-CROSS-009",
    inventory: 22,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Mocassins Cuir Firenze",
    categoryId: catByName["chaussures"],
    slug: "mocassins-cuir-firenze",
    description:
      "Mocassins en cuir souple à la semelle cousue Blake. Confort et élégance intemporelle.",
    details:
      "Cuir de veau. Semelle en cuir avec injection caoutchouc. Montage Blake. Fabriqué en Italie.",
    price: 199.0,
    compareAtPrice: 245.0,
    sku: "MOR-LOAFER-010",
    inventory: 28,
    images: [
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Chemise Lin Légère",
    categoryId: catByName["homme"],
    slug: "chemise-lin-legere",
    description:
      "Chemise en lin lavé, respirante et décontractée. Parfaite pour l'été.",
    details:
      "100% lin. Coupe droite. Boutons en nacre. Lavage machine à 30°C.",
    price: 89.0,
    compareAtPrice: null,
    sku: "MOR-SHIRT-011",
    inventory: 45,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Écharpe Cachemire",
    categoryId: catByName["femme"],
    slug: "echarpe-cachemire",
    description:
      "Écharpe en cachemire doux et chaleureux, au tombé impeccable.",
    details:
      "100% cachemire. Dimensions 180 x 30 cm. Franges main. Lavage à la main.",
    price: 119.0,
    compareAtPrice: 149.0,
    sku: "MOR-SCARF-012",
    inventory: 34,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  /*__PRODUCTS_C__*/
  products.push({
    title: "Montre Squelette Automatico",
    categoryId: catByName["montres"],
    slug: "montre-squelette-automatico",
    description:
      "Montre automatique à mouvement squelette visible. Le summum de l'horlogerie.",
    details:
      "Mouvement automatique 21 rubis. Réserve de marche 42h. Boîtier 42mm. Fond transparent. Bracelet acier.",
    price: 499.0,
    compareAtPrice: 599.0,
    sku: "MOR-WATCH-013",
    inventory: 12,
    images: [
      "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&q=80&auto=format&fit=crop",
    ],
    featured: true,
    status: "ACTIVE",
  });

  products.push({
    title: "Portefeuille Cuir Compact",
    categoryId: catByName["maroquinerie"],
    slug: "portefeuille-cuir-compact",
    description:
      "Portefeuille compact en cuir grainé, avec compartiment pour billets et cartes.",
    details:
      "Cuir de vachette grainé. 6 emplacements cartes. Porte-billets. Doublure cuir.",
    price: 59.0,
    compareAtPrice: null,
    sku: "MOR-WALLET-014",
    inventory: 90,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Trench Coat Milano",
    categoryId: catByName["femme"],
    slug: "trench-coat-milano",
    description:
      "Trench coat classique réinventé, coupe cintrée et tissu déperlant.",
    details:
      "Coton déperlant. Ceinture à la taille. Doublure contrastée. Longueur genou.",
    price: 279.0,
    compareAtPrice: 329.0,
    sku: "MOR-TRENCH-015",
    inventory: 19,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  products.push({
    title: "Bracelet Acier & Cuir",
    categoryId: catByName["accessoires"],
    slug: "bracelet-acier-cuir",
    description:
      "Bracelet mixte en acier brossé et cuir noir. Minimaliste et affirmé.",
    details:
      "Acier inoxydable 316L. Cuir véritable. Fermoir aimanté. Longueur ajustable.",
    price: 45.0,
    compareAtPrice: null,
    sku: "MOR-BRAC-016",
    inventory: 110,
    images: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80&auto=format&fit=crop",
    ],
    featured: false,
    status: "ACTIVE",
  });

  /*__PRODUCTS_D__*/

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log(`🛍️  ${products.length} produits créés`);

  console.log("✅ Seed terminé avec succès !");
  console.log("   Connexion admin  : admin@moretti.shop / admin123456");
  console.log("   Connexion client : client@moretti.shop / client123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
