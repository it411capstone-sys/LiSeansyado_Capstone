
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
  id: string; // Firestore document ID
  transactionId: string;
  referenceNumber: string; // OR Number from MTO
  date: string;
  payerId: string; // Changed from payerName
  payerName: string;
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
  ownerId: string; // New field
  ownerName: string;
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
  renewalFor?: string;
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

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Read' | 'Archived';
};

export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export type VerificationSubmission = {
  id: string;
  fisherfolkId: string;
  dateSubmitted: string;
  fishRId: string;
  boatRId: string;
  barangayCertUrl: string;
  cedulaUrl: string;
  fishRStatus: VerificationStatus;
  boatRStatus: VerificationStatus;
  barangayCertStatus: VerificationStatus;
  cedulaStatus: VerificationStatus;
  rejectionReason?: string;
  overallStatus?: 'Pending' | 'Approved' | 'Rejected';
};

export type Notification = {
  id: string;
  userId: string;
  date: string;
  title: string;
  message: string;
  type: 'Alert' | 'Info' | 'Success' | 'Error';
  category: 'Registration' | 'Payment' | 'License' | 'General' | 'Verification' | 'Inspection';
  isRead: boolean;
};

export type AdminNotification = {
  id: string;
  date: string;
  title: string;
  message: string;
  category: 'Verification' | 'Registration' | 'Inspection' | 'Payment' | 'License' | 'Feedback';
  isRead: boolean;
  link: string;
};

export type Fisherfolk = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  contact?: string;
  address?: string;
  birthday?: string;
  fishRNo?: string;
  boatRNo?: string;
  isVerified: boolean;
  avatarUrl?: string;
  lastActivity?: string;
};

export type Admin = {
    uid: string;
    name: string;
    email: string;
    role: 'mao' | 'mto' | 'mao_inspector' | 'mao_help_desk';
}

export type License = {
  id: string;
  registrationId: string;
  name: string;
  type: 'Vessel' | 'Gear';
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired' | 'Revoked';
  ownerEmail: string;
  contact?: string;
  address?: string;
}

export type AuditLogAction =
  // Page Views
  | 'ADMIN_PAGE_VIEW'

  // User Authentication (All Roles)
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_CREATED'
  | 'PASSWORD_RESET_REQUESTED'
  
  // Fisherfolk Actions
  | 'FISHERFOLK_PROFILE_UPDATED'
  | 'FISHERFOLK_VERIFICATION_SUBMITTED'
  | 'FISHERFOLK_REGISTRATION_SUBMITTED'
  | 'FISHERFOLK_RENEWAL_SUBMITTED'
  | 'FISHERFOLK_PAYMENT_RECEIPT_UPLOADED'
  | 'FISHERFOLK_FEEDBACK_SUBMITTED'

  // Admin Actions: Verification
  | 'ADMIN_VERIFICATION_SUBMISSION_VIEWED'
  | 'ADMIN_VERIFICATION_DOCUMENT_APPROVED'
  | 'ADMIN_VERIFICATION_DOCUMENT_REJECTED'
  | 'ADMIN_VERIFICATION_FINALIZED_APPROVED'
  | 'ADMIN_VERIFICATION_FINALIZED_REJECTED'
  // Admin Actions: Registration
  | 'ADMIN_REGISTRATION_VIEWED'
  | 'ADMIN_REGISTRATION_APPROVED'
  | 'ADMIN_REGISTRATION_REJECTED'
  | 'ADMIN_REGISTRATION_DELETED'
  // Admin Actions: Inspection
  | 'ADMIN_INSPECTION_SCHEDULED'
  | 'ADMIN_INSPECTION_UPDATED'
  | 'ADMIN_INSPECTION_DELETED'
  | 'ADMIN_INSPECTION_COMPLETED'
  | 'ADMIN_INSPECTION_FLAGGED'
  // Admin/MTO Actions: Payment
  | 'ADMIN_PAYMENT_VIEWED'
  | 'MTO_PAYMENT_CERTIFIED'
  | 'MAO_PAYMENT_VERIFIED' // Final verification
  | 'ADMIN_PAYMENT_REJECTED'
  // Admin Actions: License
  | 'ADMIN_LICENSE_ISSUED'
  | 'ADMIN_LICENSE_VIEWED'
  | 'ADMIN_LICENSE_PRINTED'
  | 'ADMIN_LICENSE_REVOKED'
  // Admin Actions: Messages
  | 'ADMIN_MESSAGE_VIEWED'
  | 'ADMIN_MESSAGE_STATUS_CHANGED'
  | 'ADMIN_MESSAGE_REPLIED';

export type AuditLog = {
    id: string; // Firestore document ID
    timestamp: any; // Should be a Firestore ServerTimestamp
    userId: string; // UID of the user who performed the action
    userName: string; // Name of the user for readability
    action: AuditLogAction;
    target: {
        type: 'registration' | 'payment' | 'user' | 'inspection' | 'license' | 'message' | 'verification';
        id: string; // Document ID of the affected resource
    };
    details?: Record<string, any>; // For extra context, e.g., { fromStatus: 'Pending', toStatus: 'Approved' }
};
