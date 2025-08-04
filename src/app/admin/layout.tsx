
import { AdminHeader } from "@/components/admin/admin-header";
import { LanguageToggle } from "@/components/language-toggle";
import { InspectionsProvider } from "@/contexts/inspections-context";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InspectionsProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex min-h-screen w-full flex-col">
          <AdminHeader />
          <main className="flex-1 bg-muted/40">{children}</main>
        </div>
      </Suspense>
    </InspectionsProvider>
  );
}
