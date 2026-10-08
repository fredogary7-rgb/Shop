import { cn } from "@/lib/utils";

const STATUS: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  PAID: { label: "Payée", className: "bg-blue-100 text-blue-700" },
  FULFILLED: { label: "Préparée", className: "bg-purple-100 text-purple-700" },
  SHIPPED: { label: "Expédiée", className: "bg-indigo-100 text-indigo-700" },
  DELIVERED: { label: "Livrée", className: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulée", className: "bg-red-100 text-red-700" },
  REFUNDED: { label: "Remboursée", className: "bg-gray-100 text-gray-700" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, className: "bg-gray-100 text-gray-700" };
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        s.className
      )}
    >
      {s.label}
    </span>
  );
}
