import { AdminHeader } from "@/components/admin/admin-header";
import { LanguageToggle } from "@/components/language-toggle";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex-1 bg-muted/40">{children}</main>
    </div>
  );
}
