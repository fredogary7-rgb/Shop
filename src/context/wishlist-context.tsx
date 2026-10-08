"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WishlistContextType = {
  ids: string[];
  count: number;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => Promise<boolean>;
  remove: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((data) => {
        setIds((data.items ?? []).map((i: { productId: string }) => i.productId));
      })
      .catch(() => {});
  }, []);

  const toggle = useCallback(async (productId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) return false;
      setIds((prev) =>
        data.added
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  const remove = useCallback(async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      setIds((prev) => prev.filter((id) => id !== productId));
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<WishlistContextType>(
    () => ({
      ids,
      count: ids.length,
      isWishlisted: (productId) => ids.includes(productId),
      toggle,
      remove,
    }),
    [ids, toggle, remove]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist doit être utilisé dans WishlistProvider");
  return ctx;
}
