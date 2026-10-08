"use client";

import { useTransition } from "react";
import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/app/actions/admin";
import { useToast } from "@/context/toast-context";

const OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payée" },
  { value: "FULFILLED", label: "Préparée" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
  { value: "REFUNDED", label: "Remboursée" },
];

export function OrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      const res = await updateOrderStatus(id, e.target.value as OrderStatus);
      if (res.ok) toast("Statut mis à jour !");
      else toast(res.error, "error");
    });
  };

  return (
    <select
      defaultValue={status}
      onChange={onChange}
      disabled={pending}
      className="input !w-auto !py-1.5 text-sm disabled:opacity-60"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
