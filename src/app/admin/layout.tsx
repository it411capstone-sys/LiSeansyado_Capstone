
'use client';

import { AdminHeader } from "@/components/admin/admin-header";
import { LanguageToggle } from "@/components/language-toggle";
import { InspectionsProvider } from "@/contexts/inspections-context";
import { Suspense } from "react";
import { UserNav } from "@/components/user-nav";
import { useSearchParams } from 'next/navigation';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'mto' ? 'mto' : 'admin';

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
    <InspectionsProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </Suspense>
    </InspectionsProvider>
  );
}
