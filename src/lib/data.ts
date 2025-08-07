

import { Fish, Ship, UserCog, User, AlertTriangle, FileCheck2, Search, Calendar, BadgeCheck, BadgeX, BadgeHelp } from 'lucide-react';
import { Feedback, Inspection, Payment, Registration, VerificationSubmission } from './types';

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
    registrationDate: '2025-05-12',
    expiryDate: '2025-05-12',
    status: 'Pending',
    vesselDetails: 'Small motorized banca, 5 meters, 3 GT, wooden hull.',
    fishingGearDetails: 'Standard gillnet, 100 meters length, 2-inch mesh size.',
    fishermanProfile: '15 years experience, resident of Brgy. Poblacion, Cantilan.',
    history: [
        { action: 'Inspected', date: '2025-05-13', actor: 'Inspector Dela Cruz' },
        { action: 'Renewed', date: '2025-06-01', actor: 'Admin' },
        { action: 'Info edited', date: '2025-05-15', actor: 'Admin' },
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
    registrationDate: '2025-04-28',
    expiryDate: '2025-04-28',
    status: 'Approved',
    vesselDetails: 'N/A',
    fishingGearDetails: 'Multiple hook and line setup for deep sea.',
    fishermanProfile: '20 years experience, specialized in tuna fishing.',
     history: [
        { action: 'Registered', date: '2025-04-28', actor: 'System' },
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
    registrationDate: '2025-03-16',
    expiryDate: '2025-03-16',
    status: 'Rejected',
    vesselDetails: 'No vessel, stationary gear.',
    fishingGearDetails: 'Large fish corral, bamboo and net construction, located near shore.',
    fishermanProfile: '10 years experience, operates community-based fishing.',
     history: [
        { action: 'Submitted', date: '2025-03-14', actor: 'Carlos Dela Peña' },
        { action: 'Rejected', date: '2025-03-16', actor: 'Admin' },
    ],
    boatrVerified: false,
    fishrVerified: false,
    photos: ['https://placehold.co/600x400.png'],
  },
   {
    id: 'REG-001',
    ownerName: 'Juan Dela Cruz',
    avatar: `https://i.pravatar.cc/150?u=juan.delacruz@email.com`,
    email: 'juan.delacruz@email.com',
    contact: '0920-456-7890',
    address: 'Brgy. Consuelo, Cantilan',
    vesselName: 'Bantay Dagat 1',
    gearType: 'Gillnet',
    type: 'Vessel',
    registrationDate: '2023-01-15',
    expiryDate: '2024-01-14',
    status: 'Approved',
    vesselDetails: 'Small motorized banca, 5 meters, 3 GT, wooden hull.',
    fishingGearDetails: 'Standard gillnet, 100 meters length, 2-inch mesh size.',
    fishermanProfile: '15 years experience, resident of Brgy. Poblacion, Cantilan.',
    history: [
        { action: 'Registered', date: '2023-01-15', actor: 'System' },
    ],
    boatrVerified: true,
    fishrVerified: true,
    photos: ['https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
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
    expiryDate: '2024-02-19',
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
    expiryDate: '2025-05-09',
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
    expiryDate: '2023-10-31',
    status: 'Expired',
    vesselDetails: 'Large motorized boat, 12 meters, 8 GT, steel hull.',
    fishingGearDetails: 'Commercial longline, 1000 hooks.',
    fishermanProfile: '25 years experience, commercial operator.',
     history: [
        { action: 'Expired', date: '2023-10-31', actor: 'System' },
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
    expiryDate: '2025-04-21',
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
    expiryDate: '2024-06-18',
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
    expiryDate: '2025-05-31',
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

export const inspections: Inspection[] = [];

export let payments: Payment[] = [
    {
        transactionId: 'PAY-001',
        referenceNumber: 'N/A',
        date: new Date().toISOString().split('T')[0],
        payerName: 'Juan Dela Cruz',
        payerAvatar: 'https://i.pravatar.cc/150?u=juan.delacruz@email.com',
        registrationId: 'REG-001-RENEW',
        amount: 330.00,
        status: 'Pending',
        paymentMethod: 'Over-the-Counter'
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
        email: 'juan.delacruz@email.com',
        avatar: `https://i.pravatar.cc/150?u=juan.delacruz@email.com`,
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
        id: 'VERIFY-001',
        fisherfolkId: 'FF-001',
        fisherfolkName: 'Juan Dela Cruz',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=juan.delacruz@email.com`,
        dateSubmitted: '2024-07-28',
        fishRId: 'NCR-12345-2024',
        boatRId: 'PH-98765-BT',
        barangayCertUrl: 'https://placehold.co/600x800.png',
        cedulaUrl: 'https://placehold.co/600x400.png',
        status: 'Pending'
    },
    {
        id: 'VERIFY-002',
        fisherfolkId: 'FF-002',
        fisherfolkName: 'Maria Clara',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=maria.clara`,
        dateSubmitted: '2024-07-27',
        fishRId: 'CAR-54321-2024',
        boatRId: 'PH-12345-BT',
        barangayCertUrl: 'https://placehold.co/600x800.png',
        cedulaUrl: 'https://placehold.co/600x400.png',
        status: 'Approved'
    },
    {
        id: 'VERIFY-003',
        fisherfolkId: 'FF-003',
        fisherfolkName: 'Crisostomo Ibarra',
        fisherfolkAvatar: `https://i.pravatar.cc/150?u=crisostomo.ibarra`,
        dateSubmitted: '2024-07-26',
        fishRId: 'REG1-67890-2024',
        boatRId: 'PH-54321-BT',
        barangayCertUrl: 'https://placehold.co/600x800.png',
        cedulaUrl: 'https://placehold.co/600x400.png',
        status: 'Rejected'
    },
];
