import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-serif text-7xl text-gold-400">404</p>
      <h1 className="heading-lg mt-4">Page introuvable</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn-primary mt-8 !px-8 !py-3.5 text-sm">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
