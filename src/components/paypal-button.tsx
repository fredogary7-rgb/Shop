"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal?: {
      Buttons: (opts: {
        style?: Record<string, string>;
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
      }) => { render: (selector: string) => void };
    };
  }
}

export function PayPalButton({ onSuccess }: { onSuccess?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  useEffect(() => {
    if (!clientId || !containerRef.current) return;

    const render = () => {
      window.paypal
        ?.Buttons({
          style: {
            layout: "vertical",
            shape: "rect",
            color: "gold",
            label: "paypal",
          },
          createOrder: async () => {
            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error ?? "Erreur de création de commande.");
            }
            return data.id;
          },
          onApprove: async (data) => {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const result = await res.json();
            if (!res.ok) {
              throw new Error(result.error ?? "Erreur de paiement.");
            }
            onSuccessRef.current?.();
          },
        })
        .render("#paypal-button-container");
    };

    if (window.paypal) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = render;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  if (!clientId) {
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
        Bouton PayPal indisponible : variable NEXT_PUBLIC_PAYPAL_CLIENT_ID
        manquante.
      </div>
    );
  }

  return (
    <div
      id="paypal-button-container"
      ref={containerRef}
      className="min-h-[48px]"
    />
  );
}
