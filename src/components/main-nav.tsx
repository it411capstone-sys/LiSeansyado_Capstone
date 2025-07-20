
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, FileText, CalendarCheck, BarChart2, MessageSquare, Bell, FilePlus2, Wallet, List } from 'lucide-react';
import { useTranslation } from '@/contexts/language-context';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/inspections', label: 'Inspections', icon: CalendarCheck },
    { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
    { href: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  ];

  const fisherfolkNavItems: NavItem[] = [
    { href: '/fisherfolk/home', label: 'Home', icon: Home },
    { href: '/fisherfolk/my-registrations', label: 'My Registrations', icon: List },
    { href: '/fisherfolk/register', label: 'New Registration', icon: FilePlus2 },
    { href: '/fisherfolk/payments', label: 'Payments', icon: Wallet },
    { href: '/fisherfolk/feedback', label: 'Feedback', icon: MessageSquare },
  ];

const translationKeys = [...new Set([...adminNavItems.map(i => i.label), ...fisherfolkNavItems.map(i => i.label)])];

export function MainNav({
  className,
  role = 'admin',
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' }) {
  const pathname = usePathname();
  const { t } = useTranslation(translationKeys);

  const navItems = role === 'admin' ? adminNavItems : fisherfolkNavItems;

  return (
    <nav
      className={cn('hidden md:flex items-center space-x-1 lg:space-x-2', className)}
      {...props}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors rounded-md px-3 py-2',
              isActive
                ? 'bg-muted text-primary'
                : 'text-foreground/70 hover:text-primary hover:bg-muted/50'
            )}
          >
            <Icon className="h-4 w-4" />
            {t(item.label)}
          </Link>
        )
      })}
    </nav>
  );
}
