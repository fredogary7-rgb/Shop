"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";

export function RemoveWishlistButton({ productId }: { productId: string }) {
  const { remove } = useWishlist();
  const router = useRouter();

  const handle = async () => {
    await remove(productId);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex items-center gap-1.5 text-sm text-ink-subtle transition hover:text-red-500"
    >
      <Trash2 className="h-4 w-4" />
      Retirer
    </button>
  );
}
