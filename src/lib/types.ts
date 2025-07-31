
export type Checklist = {
    vesselMatch: boolean;
    gearMatch: boolean;
    profileUpToDate: boolean;
    safetyAdequate: boolean;
    noIllegalMods: boolean;
};

export type FeeItem = {
    item: string;
    fee: number;
    hasQuantity?: boolean;
    unit?: string;
};

export type SubmittedFeeItem = FeeItem & {
    quantity: number;
};

export type FeeSummary = {
    items: SubmittedFeeItem[];
    total: number;
};

export type Inspection = {
  id: string;
  registrationId: string;
  vesselName: string;
  inspector: string;
  scheduledDate: Date;
  status: 'Scheduled' | 'Completed' | 'Flagged' | 'Pending';
  checklist: Checklist | null;
  inspectorNotes: string | null;
  photos: { name: string, url: string }[] | null;
  feeSummary: FeeSummary | null;
};
