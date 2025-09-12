

import { Fish, Ship, UserCog, User, AlertTriangle, FileCheck2, Search, Calendar, BadgeCheck, BadgeX, BadgeHelp, Bell, MessageSquareWarning } from 'lucide-react';
import { Feedback, Inspection, Notification, Payment, Registration, VerificationSubmission, License, Fisherfolk } from './types';


export const fisherfolk: Fisherfolk[] = [
    {
        uid: 'user-maria-cruz',
        firstName: 'Maria',
        lastName: 'Cruz',
        displayName: 'Maria Cruz',
        email: 'maria.cruz@example.com',
        isVerified: false,
    },
    {
        uid: 'user-john-santos',
        firstName: 'John',
        lastName: 'Santos',
        displayName: 'John Santos',
        email: 'john.santos@example.com',
        isVerified: true,
    },
    {
        uid: 'user-carlos-pena',
        firstName: 'Carlos',
        lastName: 'Dela Peña',
        displayName: 'Carlos Dela Peña',
        email: 'carlos.pena@example.com',
        isVerified: false,
    },
     {
        uid: 'user-maria-clara',
        firstName: 'Maria',
        lastName: 'Clara',
        displayName: 'Maria Clara',
        email: 'maria.clara@example.com',
        isVerified: true,
    },
    {
        uid: 'user-crisostomo-ibarra',
        firstName: 'Crisostomo',
        lastName: 'Ibarra',
        displayName: 'Crisostomo Ibarra',
        email: 'c.ibarra@example.com',
        isVerified: false,
    },
    {
        uid: 'user-andres-bonifacio',
        firstName: 'Andres',
        lastName: 'Bonifacio',
        displayName: 'Andres Bonifacio',
        email: 'a.bonifacio@example.com',
        isVerified: false,
    },
     {
        uid: 'user-gabriela-silang',
        firstName: 'Gabriela',
        lastName: 'Silang',
        displayName: 'Gabriela Silang',
        email: 'g.silang@example.com',
        isVerified: false,
    },
    {
        uid: 'user-jose-rizal',
        firstName: 'Jose',
        lastName: 'Rizal',
        displayName: 'Jose Rizal',
        email: 'j.rizal@example.com',
        isVerified: true,
    },
     {
        uid: 'user-emilio-aguinaldo',
        firstName: 'Emilio',
        lastName: 'Aguinaldo',
        displayName: 'Emilio Aguinaldo',
        email: 'e.aguinaldo@example.com',
        isVerified: false,
    },
];

export let registrations: Registration[] = [
  {
    id: 'VES-1024',
    ownerName: 'Maria Cruz',
    avatar: 'https://i.pravatar.cc/150?u=maria.cruz',
    email: 'maria.cruz@example.com',
    contact: '0917-123-4567',
    address: 'Brgy. Poblacion, Cantilan',
    vesselName: 'Bantay Dagat 1',
    gearType: 'Gillnet',
    type: 'Vessel',
    registrationDate: '2024-05-12',
    expiryDate: '2024-12-31',
    status: 'Pending',
    vesselDetails: 'Small motorized banca, 5 meters, 3 GT, wooden hull.',
    fishingGearDetails: 'Standard gillnet, 100 meters length, 2-inch mesh size.',
    fishermanProfile: '15 years experience, resident of Brgy. Poblacion, Cantilan.',
    history: [
        { action: 'Submitted', date: '2024-05-12', actor: 'Maria Cruz' },
    ],
    boatrVerified: true,
    fishrVerified: false,
    photos: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
  },
  {
    id: 'GEAR-5801',
    ownerName: 'John Santos',
    avatar: 'https://i.pravatar.cc/150?u=john.santos',
    email: 'john.santos@example.com',
    contact: '0918-234-5678',
    address: 'Brgy. Linintian, Cantilan',
    vesselName: 'No vessel, stationary gear.',
    gearType: 'Hook and Line',
    type: 'Gear',
    registrationDate: '2024-04-28',
    expiryDate: '2024-12-31',
    status: 'Approved',
    vesselDetails: 'N/A',
    fishingGearDetails: 'Multiple hook and line setup for deep sea.',
    fishermanProfile: '20 years experience, specialized in tuna fishing.',
     history: [
        { action: 'Registered', date: '2024-04-28', actor: 'System' },
    ],
    boatrVerified: true,
    fishrVerified: true,
    photos: [],
  },
  {
    id: 'VES-1009',
    ownerName: 'Carlos Dela Peña',
    avatar: 'https://i.pravatar.cc/150?u=carlos.pena',
    email: 'carlos.pena@example.com',
    contact: '0919-345-6789',
    address: 'Brgy. Magasang, Cantilan',
    vesselName: 'La Niña',
    gearType: 'Fish Corral (Baklad)',
    type: 'Vessel',
    registrationDate: '2024-03-16',
    expiryDate: '2024-12-31',
    status: 'Rejected',
    vesselDetails: 'No vessel, stationary gear.',
    fishingGearDetails: 'Large fish corral, bamboo and net construction, located near shore.',
    fishermanProfile: '10 years experience, operates community-based fishing.',
     history: [
        { action: 'Submitted', date: '2024-03-14', actor: 'Carlos Dela Peña' },
        { action: 'Rejected', date: '2024-03-16', actor: 'Admin' },
    ],
    boatrVerified: false,
    fishrVerified: false,
    photos: ['https://placehold.co/600x400.png'],
  },
  {
    id: 'REG-002',
    ownerName: 'Maria Clara',
    avatar: 'https://i.pravatar.cc/150?u=maria.clara',
    email: 'maria.clara@example.com',
    contact: '0921-567-8901',
    address: 'Brgy. San Pedro, Cantilan',
    vesselName: 'Ocean\'s Pride',
    gearType: 'Hook and Line',
    type: 'Vessel',
    registrationDate: '2023-02-20',
    expiryDate: '2023-12-31',
    status: 'Approved',
    vesselDetails: 'Medium non-motorized banca, 7 meters, 4 GT, fiberglass hull.',
    fishingGearDetails: 'Multiple hook and line setup for deep sea.',
    fishermanProfile: '20 years experience, specialized in tuna fishing.',
     history: [
        { action: 'Registered', date: '2023-02-20', actor: 'System' },
    ],
    boatrVerified: true,
    fishrVerified: true,
    photos: ['https://placehold.co/600x400.png'],
  },
  {
    id: 'REG-003',
    ownerName: 'Crisostomo Ibarra',
    avatar: 'https://i.pravatar.cc/150?u=crisostomo.ibarra',
    email: 'c.ibarra@example.com',
    contact: '0922-678-9012',
    address: 'Brgy. Parang, Cantilan',
    vesselName: 'La Niña',
    gearType: 'Fish Corral (Baklad)',
    type: 'Gear',
    registrationDate: '2024-05-10',
    expiryDate: '2024-12-31',
    status: 'Pending',
    vesselDetails: 'No vessel, stationary gear.',
    fishingGearDetails: 'Large fish corral, bamboo and net construction, located near shore.',
    fishermanProfile: '10 years experience, operates community-based fishing.',
     history: [
        { action: 'Submitted', date: '2024-05-10', actor: 'Crisostomo Ibarra' },
    ],
    boatrVerified: false,
    fishrVerified: true,
    photos: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
  },
  {
    id: 'REG-004',
    ownerName: 'Andres Bonifacio',
    avatar: 'https://i.pravatar.cc/150?u=andres.bonifacio',
    email: 'a.bonifacio@example.com',
    contact: '0923-789-0123',
    address: 'Brgy. General Island, Cantilan',
    vesselName: 'Katipunan',
    gearType: 'Longline',
    type: 'Vessel',
    registrationDate: '2022-11-01',
    expiryDate: '2022-12-31',
    status: 'Expired',
    vesselDetails: 'Large motorized boat, 12 meters, 8 GT, steel hull.',
    fishingGearDetails: 'Commercial longline, 1000 hooks.',
    fishermanProfile: '25 years experience, commercial operator.',
     history: [
        { action: 'Expired', date: '2022-12-31', actor: 'System' },
    ],
    boatrVerified: true,
    fishrVerified: true,
    photos: [],
  },
  {
    id: 'REG-005',
    ownerName: 'Gabriela Silang',
    avatar: 'https://i.pravatar.cc/150?u=gabriela.silang',
    email: 'g.silang@example.com',
    contact: '0924-890-1234',
    address: 'Brgy. Bucas Grande, Cantilan',
    vesselName: 'Freedom',
    gearType: 'Spear Gun',
    type: 'Gear',
    registrationDate: '2024-04-22',
    expiryDate: '2024-12-31',
    status: 'Rejected',
    vesselDetails: 'Small paddle boat (kayak).',
    fishingGearDetails: 'Compressed-air spear gun, used for reef fishing.',
    fishermanProfile: '5 years experience, recreational fisher.',
    history: [
        { action: 'Rejected', date: '2024-04-22', actor: 'Admin' },
    ],
    boatrVerified: false,
    fishrVerified: false,
    photos: ['https://placehold.co/600x400.png'],
  },
    {
    id: 'REG-006',
    ownerName: 'Jose Rizal',
    avatar: 'https://i.pravatar.cc/150?u=jose.rizal',
    email: 'j.rizal@example.com',
    contact: '0925-901-2345',
    address: 'Brgy. San Juan, Cantilan',
    vesselName: 'Noli Me',
    gearType: 'Cast Net',
    type: 'Vessel',
    registrationDate: '2023-06-19',
    expiryDate: '2023-12-31',
    status: 'Approved',
    vesselDetails: 'Small non-motorized banca, 4 meters, 2 GT, wooden.',
    fishingGearDetails: 'Standard cast net, 8-foot radius.',
    fishermanProfile: '8 years experience, near-shore fishing.',
     history: [
        { action: 'Registered', date: '2023-06-19', actor: 'System' },
    ],
    boatrVerified: true,
    fishrVerified: true,
    photos: ['https://placehold.co/600x400.png'],
  },
  {
    id: 'REG-007',
    ownerName: 'Emilio Aguinaldo',
    avatar: 'https://i.pravatar.cc/150?u=emilio.aguinaldo',
    email: 'e.aguinaldo@example.com',
    contact: '0926-012-3456',
    address: 'Brgy. Buntalid, Cantilan',
    vesselName: 'Magdalo',
    gearType: 'Purse Seine (Pangulong)',
    type: 'Vessel',
    registrationDate: '2024-06-01',
    expiryDate: '2024-12-31',
    status: 'Pending',
    vesselDetails: 'Large commercial vessel, 20 meters, 15 GT, steel hull, with support boats.',
    fishingGearDetails: 'Large purse seine net, requires a team of fishers.',
    fishermanProfile: 'Owner of a small fishing fleet, 30 years in business.',
     history: [
        { action: 'Submitted', date: '2024-06-01', actor: 'Emilio Aguinaldo' },
    ],
    boatrVerified: true,
    fishrVerified: false,
    photos: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
  },
];

export const getStatusIcon = (status: Registration['status']) => {
  switch (status) {
    case 'Approved':
      return BadgeCheck;
    case 'Pending':
      return BadgeHelp;
    case 'Rejected':
      return BadgeX;
    case 'Expired':
      return AlertTriangle;
    default:
      return BadgeHelp;
  }
};

export const inspections: Inspection[] = [
  {
    id: 'INSP-001',
    registrationId: 'VES-1024',
    vesselName: 'Bantay Dagat 1',
    inspector: 'Inspector Dela Cruz',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'Scheduled',
    checklist: null,
    inspectorNotes: null,
    photos: null,
    feeSummary: null,
  },
  {
    id: 'INSP-002',
    registrationId: 'REG-007',
    vesselName: 'Magdalo',
    inspector: 'Inspector Reyes',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'Scheduled',
    checklist: null,
    inspectorNotes: null,
    photos: null,
    feeSummary: null,
  },
];

export let payments: Payment[] = [
  {
    transactionId: 'PAY-1721665380123',
    referenceNumber: 'OR-987654',
    date: '2024-07-22',
    payerName: 'John Santos',
    payerAvatar: 'https://i.pravatar.cc/150?u=john.santos',
    registrationId: 'GEAR-5801',
    amount: 100.00,
    status: 'Paid',
    paymentMethod: 'Over-the-Counter',
    mtoVerifiedStatus: 'verified'
  },
  {
    transactionId: 'PAY-1721578980456',
    referenceNumber: 'N/A',
    date: '2024-07-21',
    payerName: 'Crisostomo Ibarra',
    payerAvatar: 'https://i.pravatar.cc/150?u=crisostomo.ibarra',
    registrationId: 'REG-003',
    amount: 570.00,
    status: 'Pending',
    paymentMethod: 'Over-the-Counter',
    mtoVerifiedStatus: 'unverified'
  },
  {
    transactionId: 'PAY-1721492580789',
    referenceNumber: 'N/A',
    date: '2024-07-20',
    payerName: 'Gabriela Silang',
    payerAvatar: 'https://i.pravatar.cc/150?u=gabriela.silang',
    registrationId: 'REG-005',
    amount: 50.00,
    status: 'Failed',
    paymentMethod: 'GCash',
    uploadedReceiptUrl: 'https://placehold.co/400x600.png',
    uploadedOrNumber: 'ABC12345',
    mtoVerifiedStatus: 'mismatch'
  },
   {
    transactionId: 'PAY-1721888880111',
    referenceNumber: 'N/A',
    date: '2024-07-25',
    payerName: 'Maria Cruz',
    payerAvatar: 'https://i.pravatar.cc/150?u=maria.cruz',
    registrationId: 'VES-1024',
    amount: 330.00,
    status: 'For Verification',
    paymentMethod: 'GCash',
    uploadedReceiptUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/receipts%2Freceipt-sample.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    uploadedOrNumber: 'XYZ98765',
    mtoVerifiedStatus: 'verified'
  }
];

export type User = {
    name: string;
    email: string;
    avatar: string;
    role: 'Admin' | 'Fisherfolk' | 'MTO';
};

export const users: { [key: string]: User } = {
    admin: {
        name: 'Admin User',
        email: 'mao.liseansyado@gmail.com',
        avatar: '/avatars/01.png',
        role: 'Admin'
    },
    fisherfolk: {
        name: 'Juan Dela Cruz',
        email: 'juan.d@email.com',
        avatar: `https://i.pravatar.cc/150?u=juan.d@email.com`,
        role: 'Fisherfolk'
    },
    mto: {
        name: 'MTO User',
        email: 'mto.liseansyado@gmail.com',
        avatar: 'https://i.pravatar.cc/150?u=mto.liseansyado@gmail.com',
        role: 'MTO'
    }
};

export let feedbacks: Feedback[] = [
    { id: 'FB-001', date: '2024-07-20', submittedBy: 'Juan Dela Cruz', type: 'Suggestion', status: 'New', subject: 'Improve mobile responsiveness', message: 'The registration page is hard to use on my phone. The buttons are too small.' },
    { id: 'FB-002', date: '2024-07-19', submittedBy: 'Anonymous', type: 'Complaint', status: 'In Progress', subject: 'Slow loading times on registration page', message: 'It takes a very long time to load the registration page, especially when uploading photos.' },
    { id: 'FB-003', date: '2024-07-18', submittedBy: 'Maria Clara', type: 'Inquiry', status: 'Resolved', subject: 'Question about renewal process', message: 'How do I renew my vessel license? The instructions are not clear.' },
];

export let verificationSubmissions: VerificationSubmission[] = [
    {
        id: 'VERIFY-user-andres-bonifacio',
        fisherfolkId: 'user-andres-bonifacio',
        fisherfolkName: 'Andres Bonifacio',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=andres.bonifacio`,
        dateSubmitted: '2024-07-28',
        fishRId: 'NCR-12345-2024',
        boatRId: 'PH-98765-BT',
        barangayCertUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fbarangay-cert.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        cedulaUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fcedula.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        fishRStatus: 'Pending',
        boatRStatus: 'Pending',
        barangayCertStatus: 'Pending',
        cedulaStatus: 'Pending',
    },
    {
        id: 'VERIFY-user-maria-clara',
        fisherfolkId: 'user-maria-clara',
        fisherfolkName: 'Maria Clara',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=maria.clara`,
        dateSubmitted: '2024-07-27',
        fishRId: 'CAR-54321-2024',
        boatRId: 'PH-12345-BT',
        barangayCertUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fbarangay-cert.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        cedulaUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fcedula.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        fishRStatus: 'Approved',
        boatRStatus: 'Approved',
        barangayCertStatus: 'Approved',
        cedulaStatus: 'Approved',
    },
    {
        id: 'VERIFY-user-crisostomo-ibarra',
        fisherfolkId: 'user-crisostomo-ibarra',
        fisherfolkName: 'Crisostomo Ibarra',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=crisostomo.ibarra`,
        dateSubmitted: '2024-07-26',
        fishRId: 'REG1-67890-2024',
        boatRId: 'PH-54321-BT',
        barangayCertUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fbarangay-cert.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        cedulaUrl: 'https://firebasestorage.googleapis.com/v0/b/liseansyado-ioja6.appspot.com/o/documents%2Fcedula.jpg?alt=media&token=1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        fishRStatus: 'Rejected',
        boatRStatus: 'Approved',
        barangayCertStatus: 'Pending',
        cedulaStatus: 'Approved',
    },
];

export let notifications: Notification[] = [
    {
      id: 'NOTIF-001',
      userId: 'c.ibarra@example.com',
      date: '2024-07-30',
      title: 'License Expiring Soon',
      message: 'Your license for \'Bantay Dagat 1\' (REG-001) will expire in 30 days. Please renew to avoid penalties.',
      type: 'Alert',
      isRead: false
    },
    {
      id: 'NOTIF-002',
      userId: 'maria.clara@example.com',
      date: '2024-07-29',
      title: 'Inspection Scheduled',
      message: 'An inspection for \'La Niña\' (REG-003) is scheduled for July 25, 2024.',
      type: 'Info',
      isRead: false
    },
    {
      id: 'NOTIF-003',
      userId: 'c.ibarra@example.com',
      date: '2024-07-28',
      title: 'Payment Due',
      message: 'A payment for your new registration is due. Please visit the payments page.',
      type: 'Info',
      isRead: true
    }
];

export const licenses: License[] = [
    {
        id: 'LIC-GEAR-5801-2024',
        registrationId: 'GEAR-5801',
        name: 'Hook and Line License',
        type: 'Gear',
        issueDate: '2024-04-28',
        expiryDate: '2024-12-31',
        status: 'Active',
        ownerEmail: 'john.santos@example.com'
    },
    {
        id: 'LIC-VES-002-2023',
        registrationId: 'REG-002',
        name: 'Ocean\'s Pride License',
        type: 'Vessel',
        issueDate: '2023-02-20',
        expiryDate: '2023-12-31',
        status: 'Expired',
        ownerEmail: 'maria.clara@example.com'
    },
    {
        id: 'LIC-VES-006-2023',
        registrationId: 'REG-006',
        name: 'Noli Me License',
        type: 'Vessel',
        issueDate: '2023-06-19',
        expiryDate: '2023-12-31',
        status: 'Expired',
        ownerEmail: 'j.rizal@example.com'
    }
];
