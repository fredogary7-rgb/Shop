"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [""];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-dark">
        {safeImages[active] ? (
          <Image
            src={safeImages[active]}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-subtle">
            Aucune image
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {safeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === active ? "border-gold-400" : "border-transparent"
              )}
            >
              <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
