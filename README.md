# Moretti Shop

Boutique e-commerce professionnelle inspirée de Shopify — élégance à l'italienne.

## ✨ Fonctionnalités

- **Accueil** : hero, catégories, produits vedettes, avis clients, newsletter
- **Boutique** : catalogue avec filtres par catégorie et tri
- **Fiche produit** : galerie d'images, prix, disponibilité, ajout au panier
- **Panier** : ajout, modification, suppression (persisté en local)
- **Checkout** : commande avec calcul TVA / livraison
- **Authentification** : inscription, connexion, déconnexion (JWT sécurisé)
- **Compte client** : profil, historique des commandes
- **Espace admin** : produits, catégories, commandes, clients
- **Recherche** : recherche de produits

## 🛠️ Stack technique

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (design premium)
- **Prisma ORM** + **PostgreSQL** (Neon)
- **JWT** (`jose`) + **bcryptjs** pour l'authentification
- **Zod** pour la validation

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL et JWT_SECRET

# 3. Synchroniser le schéma de base de données
npm run db:push

# 4. Peupler la base avec des données de démonstration
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

Le site est alors disponible sur http://localhost:3000

## 🔑 Comptes de démonstration

| Rôle   | Email               | Mot de passe    |
| ------ | ------------------- | --------------- |
| Admin  | admin@moretti.shop  | admin123456     |
| Client | client@moretti.shop | client123456    |

## 📁 Structure

```
src/
├── app/            # Pages (App Router) + routes API
├── components/     # Composants réutilisables
├── context/        # Contextes React (panier, notifications)
└── lib/            # Prisma, auth, utilitaires, validations
prisma/
├── schema.prisma   # Schéma de base de données
└── seed.mjs        # Données de démonstration
```
