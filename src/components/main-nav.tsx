'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, FileText, CalendarCheck, BarChart2, MessageSquare, Bell } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

export function MainNav({
  className,
  role = 'admin',
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' }) {
  const pathname = usePathname();

  const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/registrations', label: 'Registrations', icon: FileText },
    { href: '/admin/inspections', label: 'Inspections', icon: CalendarCheck },
    { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
    { href: '/admin/feedbacks', label: 'Feedbacks', icon: MessageSquare },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  ];

  const fisherfolkNavItems = [
    { href: '/fisherfolk/home', label: 'Home' },
    { href: '/fisherfolk/my-registrations', label: 'My Registrations' },
    { href: '/fisherfolk/register', label: 'New Registration' },
    { href: '/fisherfolk/payments', label: 'Payments' },
    { href: '/fisherfolk/feedback', label: 'Feedback' },
  ];

  const navItems = role === 'admin' ? adminNavItems : fisherfolkNavItems.map(item => ({ ...item, icon: Home })); // temp icon

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
            {item.label}
          </Link>
        )
      })}
    </nav>
  );
}
