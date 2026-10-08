"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/admin";
import { useToast } from "@/context/toast-context";

export function DeleteCategoryButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();

  const handle = () => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res.ok) toast("Catégorie supprimée.");
      else toast(res.error, "error");
    });
  };

  return (
    <button
      type="button"
      onClick={handle}
      disabled={pending}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-subtle transition hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
      aria-label="Supprimer"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
