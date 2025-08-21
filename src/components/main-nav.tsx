
'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, FileText, CalendarCheck, BarChart2, MessageSquare, Bell, FilePlus2, Wallet, List, Settings, ShieldCheck, Award } from 'lucide-react';
import { useMemo } from 'react';
import { users, verificationSubmissions } from '@/lib/data';
import { NavItem, adminNavItems, mtoNavItems, fisherfolkNavItems } from '@/lib/nav-items';

export function MainNav({
  className,
  role = 'admin',
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' | 'mto' }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentUser = users.fisherfolk;
  const userVerification = useMemo(() => 
      verificationSubmissions.find(sub => sub.fisherfolkName === currentUser.name), 
  [currentUser.name]);

  const isVerified = useMemo(() => 
      userVerification && 
      userVerification.fishRStatus === 'Approved' &&
      userVerification.boatRStatus === 'Approved' &&
      userVerification.barangayCertStatus === 'Approved' &&
      userVerification.cedulaStatus === 'Approved',
  [userVerification]);

  let navItems;
  if (role === 'admin') {
    navItems = adminNavItems;
  } else if (role === 'mto') {
    navItems = mtoNavItems;
  } else {
    navItems = isVerified 
      ? fisherfolkNavItems 
      : fisherfolkNavItems.filter(item => item.href !== '/fisherfolk/register');
  }


  return (
    <nav
      className={cn('hidden md:flex items-center space-x-1 lg:space-x-2', className)}
      {...props}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        const hrefWithRole = role === 'admin' || role === 'mto' ? `${item.href}?role=${role}` : item.href;
        return (
          <Link
            key={item.href}
            href={hrefWithRole}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2',
              isActive
                ? 'text-primary font-bold'
                : 'text-foreground/70 hover:text-primary hover:font-bold'
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
