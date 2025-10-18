
import { AdminHeader } from "@/components/admin/admin-header";
import { AuthProvider } from "@/contexts/auth-context";
import { InspectionsProvider } from "@/contexts/inspections-context";
import { Suspense } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <InspectionsProvider>
          <div className="flex min-h-screen w-full flex-col">
            <AdminHeader />
            <main className="flex flex-1">
              <div className="flex flex-col flex-1 bg-muted/40">
                {children}
              </div>
            </main>
          </div>
        </InspectionsProvider>
      </AuthProvider>
    </Suspense>
  );
}
