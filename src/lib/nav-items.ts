
import { Home, FileText, CalendarCheck, BarChart2, MessageSquare, Bell, FilePlus2, Wallet, List, Settings, ShieldCheck, Award, RefreshCw, ScanSearch } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/verification', label: 'Verification', icon: ShieldCheck },
    { href: '/admin/registrations', label: 'Registration', icon: FileText },
    { href: '/admin/inspections', label: 'Inspection', icon: CalendarCheck },
    { href: '/admin/payments', label: 'Payment', icon: Wallet },
    { href: '/admin/licenses', label: 'License', icon: Award },
    { href: '/admin/feedbacks', label: 'Messages', icon: MessageSquare },
];

export const fisherfolkNavItems: NavItem[] = [
    { href: '/fisherfolk/home', label: 'Home', icon: Home },
    { href: '/fisherfolk/register', label: 'New Registration', icon: FilePlus2 },
    { href: '/fisherfolk/my-registrations', label: 'My Registrations', icon: List },
    { href: '/fisherfolk/payments', label: 'Payments', icon: Wallet },
    { href: '/fisherfolk/licenses', label: 'Licenses', icon: Award },
    { href: '/fisherfolk/feedback', label: 'Feedback', icon: MessageSquare },
    { href: '/fisherfolk/notifications', label: 'Notifications', icon: Bell },
];

export const mtoNavItems: NavItem[] = [
    { href: '/mto/payments', label: 'Payments', icon: Wallet },
];

export const maoInspectorNavItems: NavItem[] = [
    { href: '/admin/inspections', label: 'Inspection', icon: ScanSearch },
];
