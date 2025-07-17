import { RegistrationsClient } from "@/components/admin/registrations-client";
import { registrations } from "@/lib/data";

export default function AdminRegistrationsPage() {

  // In a real app, you'd fetch this data from an API
  const allRegistrations = registrations;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <RegistrationsClient data={allRegistrations} />
    </div>
  );
}
