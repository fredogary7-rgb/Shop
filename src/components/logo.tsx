import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="Moretti Shop — Accueil"
    >
      <Image
        src="/logo-mark.svg"
        alt="Moretti Shop"
        width={40}
        height={40}
        unoptimized
        priority
        className="h-10 w-10 shrink-0"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-lg tracking-[0.18em] sm:text-xl",
            light ? "text-cream" : "text-ink"
          )}
        >
          MORETTI
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-600">
          Shop
        </span>
      </span>
    </Link>
  );
}
