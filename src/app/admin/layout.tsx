import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-ink text-cream">
        <div className="shell flex h-16 items-center justify-between">
          <Logo light />
          <div className="flex items-center gap-5">
            <span className="hidden text-sm text-cream/70 sm:block">
              Admin · {user.name}
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-gold-300 transition hover:text-gold-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au site
            </Link>
          </div>
        </div>
      </div>

      <div className="shell flex flex-col gap-8 py-8 md:flex-row">
        <aside className="shrink-0 md:w-56">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
