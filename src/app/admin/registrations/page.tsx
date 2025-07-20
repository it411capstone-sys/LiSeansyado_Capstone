
'use client';
import { RegistrationsClient } from "@/components/admin/registrations-client";
import { registrations } from "@/lib/data";
import { useTranslation } from "@/contexts/language-context";

const translationKeys = [
    "Search by Owner or Vessel ID...",
    "Status: All",
    "Status: ",
    "Date",
    "Type: All",
    "Type: ",
    "Approved", "Pending", "Rejected", "Expired",
    "Vessel", "Gear",
    "Owner Name",
    "Vessel/Gear ID",
    "Status",
    "Actions",
    "Approve",
    "Reject",
    "Send Reminder",
    "No results found.",
    "Showing 1-",
    " of ",
    " records",
    "No Registration Selected",
    "Click on a registration from the list to view its details here.",
    "Gear/Vessel Photos",
    "No photos uploaded.",
    "Verification Status",
    "BoatR Verified",
    "BoatR Unverified",
    "FishR Verified",
    "FishR Unverified",
    "Verify BoatR",
    "Verify FishR",
    "Registration Date",
    "Type",
    "History Log",
    "Inspected",
    "Renewed",
    "Info edited",
    "Registered",
    "Submitted",
    " on ",
    " by ",
    "Schedule Inspection"
];

export default function AdminRegistrationsPage() {
    useTranslation(translationKeys);
  // In a real app, you'd fetch this data from an API
  const allRegistrations = registrations;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <RegistrationsClient data={allRegistrations} />
    </div>
  );
}
