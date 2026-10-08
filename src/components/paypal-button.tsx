"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    paypal?: {
      HostedButtons: (opts: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}

export function PayPalButton() {
  const containerRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const hostedButtonId = process.env.NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID;

  useEffect(() => {
    if (!clientId || !hostedButtonId || !containerRef.current) return;

    const containerId = `paypal-container-${hostedButtonId}`;

    const render = () => {
      window.paypal?.HostedButtons({ hostedButtonId }).render(`#${containerId}`);
    };

    if (window.paypal) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&disable-funding=venmo&currency=USD`;
    script.async = true;
    script.onload = render;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, hostedButtonId]);

  if (!clientId || !hostedButtonId) {
    return (
      <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
        Bouton PayPal indisponible : variables d&apos;environnement manquantes
        (NEXT_PUBLIC_PAYPAL_CLIENT_ID / NEXT_PUBLIC_PAYPAL_HOSTED_BUTTON_ID).
      </div>
    );
  }

  return (
    <div
      id={`paypal-container-${hostedButtonId}`}
      ref={containerRef}
      className="min-h-[48px]"
    />
  );
}

