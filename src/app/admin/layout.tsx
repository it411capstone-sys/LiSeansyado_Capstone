import { AdminHeader } from "@/components/admin/admin-header";
import { LanguageToggle } from "@/components/language-toggle";
import { InspectionsProvider } from "@/contexts/inspections-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InspectionsProvider>
      <div className="flex min-h-screen w-full flex-col">
        <AdminHeader />
        <main className="flex-1 bg-muted/40">{children}</main>
      </div>
    </InspectionsProvider>
  );
}
