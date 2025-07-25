
export type Checklist = {
    vesselMatch: boolean;
    gearMatch: boolean;
    profileUpToDate: boolean;
    safetyAdequate: boolean;
    noIllegalMods: boolean;
};

export type Inspection = {
  id: string;
  registrationId: string;
  vesselName: string;
  inspector: string;
  scheduledDate: string;
  status: 'Scheduled' | 'Completed' | 'Flagged' | 'Pending';
  checklist: Checklist | null;
  inspectorNotes: string | null;
  photos: { name: string, url: string }[] | null;
};
