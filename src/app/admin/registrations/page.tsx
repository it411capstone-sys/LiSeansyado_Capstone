
'use client';
import { RegistrationsClient } from "@/components/admin/registrations-client";
import { useTranslation } from "@/contexts/language-context";

export default function AdminRegistrationsPage() {
    useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <RegistrationsClient />
    </div>
  );
}
