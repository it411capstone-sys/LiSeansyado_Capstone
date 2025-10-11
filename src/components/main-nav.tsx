
'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { adminNavItems, mtoNavItems, fisherfolkNavItems } from '@/lib/nav-items';
import { useAuth } from '@/hooks/use-auth';
import { VerificationSubmission } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from './ui/badge';

export function MainNav({
  className,
  role = 'admin',
  unreadCounts = { notifications: 0, registrations: 0, payments: 0, licenses: 0 },
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' | 'mto', unreadCounts?: { notifications: number, registrations: number, payments: number, licenses: number } }) {
  const [pathname, setPathname] = useState('/admin/dashboard'); // Mock pathname
  const { user, userData } = useAuth();
  const [userVerification, setUserVerification] = useState<VerificationSubmission | null>(null);
  
  useEffect(() => {
    if (user && role === 'fisherfolk') {
        const unsub = onSnapshot(doc(db, "verificationSubmissions", user.uid), (doc) => {
            if (doc.exists()) {
                setUserVerification(doc.data() as VerificationSubmission);
            }
        });
        return () => unsub();
    }
  }, [user, role]);

  const isVerified = useMemo(() => 
      userVerification && userVerification.overallStatus === 'Approved',
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
        const hrefWithRole = item.href;

        let count = 0;
        if (role === 'fisherfolk') {
            if (item.label === 'Notifications') count = unreadCounts.notifications;
            if (item.label === 'My Registrations') count = unreadCounts.registrations;
            if (item.label === 'Payments') count = unreadCounts.payments;
            if (item.label === 'Licenses') count = unreadCounts.licenses;
        }
        
        return (
          <Link
            key={item.href}
            href={hrefWithRole}
            onClick={() => setPathname(item.href)}
            className={cn(
              'flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 relative',
              isActive
                ? 'text-primary font-bold'
                : 'text-foreground/70 hover:text-primary hover:font-bold'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
             {count > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full p-1 text-xs">
                    {count}
                </Badge>
            )}
          </Link>
        )
      })}
    </nav>
  );
}
