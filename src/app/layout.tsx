import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";
import { hasActiveSubscription } from "@/lib/subscription";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moretti.shop"),
  title: {
    default: "Moretti Shop — Élégance à l'italienne",
    template: "%s | Moretti Shop",
  },
  description:
    "Moretti Shop, votre boutique en ligne premium : mode, maroquinerie, montres et accessoires d'exception. L'élégance à l'italienne, livrée chez vous.",
  keywords: [
    "Moretti",
    "Shop",
    "e-commerce",
    "mode",
    "maroquinerie",
    "montres",
    "accessoires",
    "luxe",
  ],
  openGraph: {
    title: "Moretti Shop — Élégance à l'italienne",
    description:
      "Mode, maroquinerie, montres et accessoires d'exception. L'élégance à l'italienne.",
    type: "website",
    locale: "fr_FR",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const subscriptionActive = user ? await hasActiveSubscription(user.id) : false;

  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        <Providers>
          <Header user={user} subscriptionActive={subscriptionActive} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
