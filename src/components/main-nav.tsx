'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
};

export function MainNav({
  className,
  role = 'admin',
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' }) {
  const pathname = usePathname();

  const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/registrations', label: 'Registrations' },
    { href: '/admin/inspections', label: 'Inspections' },
    { href: '/admin/reports', label: 'Reports' },
  ];

  const fisherfolkNavItems: NavItem[] = [
    { href: '/fisherfolk/home', label: 'Home' },
    { href: '/fisherfolk/my-registrations', label: 'My Registrations' },
    { href: '/fisherfolk/register', label: 'New Registration' },
    { href: '/fisherfolk/payments', label: 'Payments' },
    { href: '/fisherfolk/feedback', label: 'Feedback' },
  ];

  const navItems = role === 'admin' ? adminNavItems : fisherfolkNavItems;

  return (
    <nav
      className={cn('hidden md:flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname.startsWith(item.href)
              ? 'text-primary'
              : 'text-foreground/60'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
