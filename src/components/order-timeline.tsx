import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "PENDING", label: "Confirmée" },
  { key: "PAID", label: "Payée" },
  { key: "FULFILLED", label: "Préparée" },
  { key: "SHIPPED", label: "Expédiée" },
  { key: "DELIVERED", label: "Livrée" },
];

const ORDER = ["PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED"];

export function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
        {status === "CANCELLED"
          ? "Cette commande a été annulée."
          : "Cette commande a été remboursée."}
      </div>
    );
  }

  const current = ORDER.indexOf(status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const done = i <= current;
        const isLast = i === STEPS.length - 1;
        return (
          <div
            key={step.key}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  done
                    ? "border-gold-400 bg-gold-400 text-ink"
                    : "border-ink/15 bg-white text-ink-subtle"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "mt-1.5 text-[11px]",
                  done ? "font-semibold text-ink" : "text-ink-subtle"
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 mb-5 h-0.5 flex-1",
                  i < current ? "bg-gold-400" : "bg-ink/10"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
