
'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { adminNavItems, mtoNavItems, fisherfolkNavItems } from '@/lib/nav-items';
import { useAuth } from '@/hooks/use-auth';
import { VerificationSubmission } from '@/lib/types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function MainNav({
  className,
  role = 'admin',
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' | 'mto' }) {
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
        return (
          <Link
            key={item.href}
            href={hrefWithRole}
            onClick={() => setPathname(item.href)}
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
