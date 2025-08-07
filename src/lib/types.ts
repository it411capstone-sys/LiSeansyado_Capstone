

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

export type Payment = {
  transactionId: string;
  referenceNumber: string; // OR Number from MTO
  date: string;
  payerName: string;
  payerAvatar: string;
  registrationId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'For Verification';
  paymentMethod: string;
  uploadedReceiptUrl?: string | null;
  uploadedOrNumber?: string | null;
  mtoVerifiedStatus?: 'unverified' | 'verified' | 'mismatch';
};

export type Registration = {
  id: string;
  ownerName: string;
  avatar: string;
  email: string;
  contact: string;
  address: string;
  vesselName: string;
  gearType: string;
  type: 'Vessel' | 'Gear';
  registrationDate: string;
  expiryDate: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  vesselDetails: string;
  fishingGearDetails: string;
  fishermanProfile: string;
  history: {
      action: string;
      date: string;
      actor: string;
  }[];
  boatrVerified: boolean;
  fishrVerified: boolean;
  photos: string[];
};

export type Feedback = {
  id: string;
  date: string;
  submittedBy: string;
  type: 'Complaint' | 'Suggestion' | 'Inquiry' | 'Bug' | 'Other';
  status: 'New' | 'In Progress' | 'Resolved' | 'Denied';
  subject: string;
  message: string;
};

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export type VerificationSubmission = {
  id: string;
  fisherfolkId: string;
  fisherfolkName: string;
  fisherfolkAvatar: string;
  dateSubmitted: string;
  fishRId: string;
  boatRId: string;
  barangayCertUrl: string;
  cedulaUrl: string;
  fishRStatus: VerificationStatus;
  boatRStatus: VerificationStatus;
};
