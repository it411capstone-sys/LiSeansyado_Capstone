
'use client';

import { AdminHeader } from "@/components/admin/admin-header";
import { LanguageToggle } from "@/components/language-toggle";
import { Suspense } from "react";
import { UserNav } from "@/components/user-nav";
import { InspectionsProvider } from "@/contexts/inspections-context";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex min-h-screen w-full flex-col">
        <AdminHeader />
        <main className="flex flex-1">
          <div className="flex flex-col flex-1 bg-muted/40">
            {children}
          </div>
        </main>
      </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <InspectionsProvider>
          <AdminLayoutContent>{children}</AdminLayoutContent>
        </InspectionsProvider>
      </Suspense>
  );
}
