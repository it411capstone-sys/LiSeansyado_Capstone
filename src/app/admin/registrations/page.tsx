
'use client';
import { RegistrationsClient } from "@/components/admin/registrations-client";
import { registrations } from "@/lib/data";
import { useTranslation } from "@/contexts/language-context";

export default function AdminRegistrationsPage() {
    useTranslation();
  // In a real app, you'd fetch this data from an API
  const allRegistrations = registrations;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <RegistrationsClient data={allRegistrations} />
    </div>
  );
}
