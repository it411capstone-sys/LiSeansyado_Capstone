import { Fish, Ship, UserCog, User, AlertTriangle, FileCheck2, Search, Calendar, BadgeCheck, BadgeX, BadgeHelp } from 'lucide-react';

export type Registration = {
  id: string;
  ownerName: string;
  vesselName: string;
  gearType: string;
  registrationDate: string;
  expiryDate: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'Expired';
  vesselDetails: string;
  fishingGearDetails: string;
  fishermanProfile: string;
};

export const registrations: Registration[] = [
  {
    id: 'REG-001',
    ownerName: 'Juan Dela Cruz',
    vesselName: 'Bantay Dagat 1',
    gearType: 'Gillnet',
    registrationDate: '2023-01-15',
    expiryDate: '2024-01-14',
    status: 'Approved',
    vesselDetails: 'Small motorized banca, 5 meters, 3 GT, wooden hull.',
    fishingGearDetails: 'Standard gillnet, 100 meters length, 2-inch mesh size.',
    fishermanProfile: '15 years experience, resident of Brgy. Poblacion, Cantilan.',
  },
  {
    id: 'REG-002',
    ownerName: 'Maria Clara',
    vesselName: 'Ocean\'s Pride',
    gearType: 'Hook and Line',
    registrationDate: '2023-02-20',
    expiryDate: '2024-02-19',
    status: 'Approved',
    vesselDetails: 'Medium non-motorized banca, 7 meters, 4 GT, fiberglass hull.',
    fishingGearDetails: 'Multiple hook and line setup for deep sea.',
    fishermanProfile: '20 years experience, specialized in tuna fishing.',
  },
  {
    id: 'REG-003',
    ownerName: 'Crisostomo Ibarra',
    vesselName: 'La Niña',
    gearType: 'Fish Corral (Baklad)',
    registrationDate: '2024-05-10',
    expiryDate: '2025-05-09',
    status: 'Pending',
    vesselDetails: 'No vessel, stationary gear.',
    fishingGearDetails: 'Large fish corral, bamboo and net construction, located near shore.',
    fishermanProfile: '10 years experience, operates community-based fishing.',
  },
  {
    id: 'REG-004',
    ownerName: 'Andres Bonifacio',
    vesselName: 'Katipunan',
    gearType: 'Longline',
    registrationDate: '2022-11-01',
    expiryDate: '2023-10-31',
    status: 'Expired',
    vesselDetails: 'Large motorized boat, 12 meters, 8 GT, steel hull.',
    fishingGearDetails: 'Commercial longline, 1000 hooks.',
    fishermanProfile: '25 years experience, commercial operator.',
  },
  {
    id: 'REG-005',
    ownerName: 'Gabriela Silang',
    vesselName: 'Freedom',
    gearType: 'Spear Gun',
    registrationDate: '2024-04-22',
    expiryDate: '2025-04-21',
    status: 'Rejected',
    vesselDetails: 'Small paddle boat (kayak).',
    fishingGearDetails: 'Compressed-air spear gun, used for reef fishing.',
    fishermanProfile: '5 years experience, recreational fisher.',
  },
    {
    id: 'REG-006',
    ownerName: 'Jose Rizal',
    vesselName: 'Noli Me',
    gearType: 'Cast Net',
    registrationDate: '2023-06-19',
    expiryDate: '2024-06-18',
    status: 'Approved',
    vesselDetails: 'Small non-motorized banca, 4 meters, 2 GT, wooden.',
    fishingGearDetails: 'Standard cast net, 8-foot radius.',
    fishermanProfile: '8 years experience, near-shore fishing.',
  },
  {
    id: 'REG-007',
    ownerName: 'Emilio Aguinaldo',
    vesselName: 'Magdalo',
    gearType: 'Purse Seine (Pangulong)',
    registrationDate: '2024-06-01',
    expiryDate: '2025-05-31',
    status: 'Pending',
    vesselDetails: 'Large commercial vessel, 20 meters, 15 GT, steel hull, with support boats.',
    fishingGearDetails: 'Large purse seine net, requires a team of fishers.',
    fishermanProfile: 'Owner of a small fishing fleet, 30 years in business.',
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

export type Inspection = {
  id: string;
  registrationId: string;
  vesselName: string;
  inspector: string;
  scheduledDate: string;
  status: 'Scheduled' | 'Completed' | 'Flagged' | 'Pending';
};

export const inspections: Inspection[] = [
    { id: 'INSP-001', registrationId: 'REG-003', vesselName: 'La Niña', inspector: 'John Doe', scheduledDate: '2024-07-25', status: 'Scheduled' },
    { id: 'INSP-002', registrationId: 'REG-007', vesselName: 'Magdalo', inspector: 'Jane Smith', scheduledDate: '2024-07-28', status: 'Scheduled' },
    { id: 'INSP-003', registrationId: 'REG-001', vesselName: 'Bantay Dagat 1', inspector: 'John Doe', scheduledDate: '2024-01-10', status: 'Completed' },
    { id: 'INSP-004', registrationId: 'REG-005', vesselName: 'Freedom', inspector: 'Jane Smith', scheduledDate: '2024-04-20', status: 'Flagged' },
];

export type User = {
    name: string;
    email: string;
    avatar: string;
    role: 'Admin' | 'Fisherfolk';
};

export const users: { [key: string]: User } = {
    admin: {
        name: 'Admin User',
        email: 'admin@liseansyado.gov.ph',
        avatar: '/avatars/01.png',
        role: 'Admin'
    },
    fisherfolk: {
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@email.com',
        avatar: '/avatars/02.png',
        role: 'Fisherfolk'
    }
}
