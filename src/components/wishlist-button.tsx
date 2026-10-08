"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { useToast } from "@/context/toast-context";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const { toast } = useToast();
  const active = isWishlisted(productId);

  const handle = async () => {
    const wasActive = active;
    const ok = await toggle(productId);
    if (!ok) {
      toast("Connectez-vous pour ajouter aux favoris.", "error");
      return;
    }
    toast(wasActive ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition hover:border-red-400 hover:text-red-500",
        className
      )}
      aria-label="Ajouter aux favoris"
    >
      <Heart className={cn("h-5 w-5", active && "fill-red-500 text-red-500")} />
    </button>
  );
}
