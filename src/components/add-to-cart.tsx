"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";

export function AddToCart({
  product,
  disabled = false,
}: {
  product: { id: string; title: string; price: number; image: string };
  disabled?: boolean;
}) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      qty
    );
    toast(`${product.title} ajouté au panier`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="flex items-center justify-between rounded-full border border-ink/15 bg-white px-2">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="flex h-10 w-10 items-center justify-center text-ink transition hover:text-gold-600"
          aria-label="Diminuer la quantité"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center text-sm font-semibold text-ink">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="flex h-10 w-10 items-center justify-center text-ink transition hover:text-gold-600"
          aria-label="Augmenter la quantité"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="btn-primary flex-1 !px-8 !py-3.5 text-sm"
      >
        <ShoppingBag className="h-4 w-4" />
        {disabled ? "Indisponible" : "Ajouter au panier"}
      </button>
    </div>
  );
}
