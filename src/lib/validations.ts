import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Veuillez saisir votre mot de passe"),
});

export const checkoutSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  name: z.string().min(2, "Nom requis"),
  phone: z.string().optional(),
  address: z.string().min(3, "Adresse requise"),
  city: z.string().min(2, "Ville requise"),
  country: z.string().min(2, "Pays requis"),
  postalCode: z.string().min(2, "Code postal requis"),
  paymentMethod: z.string().default("card"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        title: z.string(),
        price: z.number(),
        quantity: z.number().int().min(1),
        image: z.string().optional(),
      })
    )
    .min(1, "Votre panier est vide"),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Nom requis").max(100),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const productSchema = z.object({
  title: z.string().min(2, "Titre requis").max(200),
  description: z.string().min(10, "Description trop courte"),
  details: z.string().optional(),
  price: z.coerce.number().positive("Prix invalide"),
  compareAtPrice: z.coerce.number().positive().optional(),
  sku: z.string().min(1, "SKU requis"),
  inventory: z.coerce.number().int().min(0),
  images: z.array(z.string()).min(1, "Au moins une image requise"),
  featured: z.boolean().optional(),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).optional(),
  categoryId: z.string().min(1, "Catégorie requise"),
});
