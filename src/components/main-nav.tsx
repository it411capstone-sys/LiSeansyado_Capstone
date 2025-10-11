
'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useMemo, useState, useEffect } from 'react';
import { adminNavItems, mtoNavItems, fisherfolkNavItems } from '@/lib/nav-items';
import { useAuth } from '@/hooks/use-auth';
import { VerificationSubmission, AdminNotification, Registration, Payment, License, Notification as FisherfolkNotification } from '@/lib/types';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from './ui/badge';

type UnreadCounts = {
    Verification: number;
    Registration: number;
    Inspection: number;
    Payment: number;
    License: number;
    Feedback: number;
    Notifications: number; 
};

export function MainNav({
  className,
  role = 'admin',
  unreadCounts,
  ...props
}: React.HTMLAttributes<HTMLElement> & { role: 'admin' | 'fisherfolk' | 'mto', unreadCounts?: any }) {
  const [pathname, setPathname] = useState('/admin/dashboard'); // Mock pathname
  const { user } = useAuth();
  const [userVerification, setUserVerification] = useState<VerificationSubmission | null>(null);
  const [adminUnreadCounts, setAdminUnreadCounts] = useState<UnreadCounts>({
      Verification: 0,
      Registration: 0,
      Inspection: 0,
      Payment: 0,
      License: 0,
      Feedback: 0,
      Notifications: 0,
  });
   const [fisherfolkUnreadCounts, setFisherfolkUnreadCounts] = useState({
      notifications: 0,
      registrations: 0,
      payments: 0,
      licenses: 0,
  });

  useEffect(() => {
    if (user && role === 'fisherfolk') {
        const unsub = onSnapshot(doc(db, "verificationSubmissions", user.uid), (doc) => {
            if (doc.exists()) {
                setUserVerification(doc.data() as VerificationSubmission);
            }
        });
        
        const notifQuery = query(collection(db, "notifications"), where("userId", "==", user.email), where("isRead", "==", false));
        const unsubNotifications = onSnapshot(notifQuery, (snapshot) => {
             let registrationCount = 0;
            let paymentCount = 0;
            let licenseCount = 0;

            snapshot.forEach(doc => {
                const notification = doc.data() as FisherfolkNotification;
                switch (notification.category) {
                    case 'Registration':
                        registrationCount++;
                        break;
                    case 'Payment':
                        paymentCount++;
                        break;
                    case 'License':
                        licenseCount++;
                        break;
                    default:
                        break;
                }
            });
            setFisherfolkUnreadCounts({
                notifications: snapshot.size,
                registrations: registrationCount,
                payments: paymentCount,
                licenses: licenseCount,
            });
        });
        
        return () => {
            unsub();
            unsubNotifications();
        };
    }

    if (role === 'admin') {
      const verificationsQuery = query(collection(db, "verificationSubmissions"), where("overallStatus", "==", "Pending"));
      const registrationsQuery = query(collection(db, "registrations"), where("status", "==", "Pending"));
      const renewalsQuery = query(collection(db, "licenseRenewals"), where("status", "==", "Pending"));
      const inspectionsQuery = query(collection(db, "inspections"), where("status", "==", "Scheduled"));
      const paymentsQuery = query(collection(db, "payments"), where("status", "in", ["Pending", "For Verification"]));
      const feedbacksQuery = query(collection(db, "feedbacks"), where("status", "==", "New"));

      const allRegsQuery = query(collection(db, "registrations"), where("status", "==", "Approved"));
      const allRenewalsQuery = query(collection(db, "licenseRenewals"), where("status", "==", "Approved"));
      const allPaidPaymentsQuery = query(collection(db, "payments"), where("status", "==", "Paid"));
      const allLicensesQuery = query(collection(db, "licenses"));
      const adminNotificationsQuery = query(collection(db, "adminNotifications"), where("isRead", "==", false));

      const unsubs = [
        onSnapshot(verificationsQuery, snapshot => setAdminUnreadCounts(p => ({ ...p, Verification: snapshot.size }))),
        onSnapshot(registrationsQuery, regSnapshot => {
            onSnapshot(renewalsQuery, renewalSnapshot => {
                setAdminUnreadCounts(p => ({ ...p, Registration: regSnapshot.size + renewalSnapshot.size }));
            });
        }),
        onSnapshot(inspectionsQuery, snapshot => setAdminUnreadCounts(p => ({ ...p, Inspection: snapshot.size }))),
        onSnapshot(paymentsQuery, snapshot => setAdminUnreadCounts(p => ({ ...p, Payment: snapshot.size }))),
        onSnapshot(feedbacksQuery, snapshot => setAdminUnreadCounts(p => ({ ...p, Feedback: snapshot.size }))),
        onSnapshot(allRegsQuery, (regSnap) => {
            onSnapshot(allRenewalsQuery, (renewalSnap) => {
                onSnapshot(allPaidPaymentsQuery, (paymentSnap) => {
                    onSnapshot(allLicensesQuery, (licenseSnap) => {
                        const approvedRegs = [...regSnap.docs.map(d => d.id), ...renewalSnap.docs.map(d => d.id)];
                        const paidRegIds = new Set(paymentSnap.docs.map(d => d.data().registrationId));
                        const licensedRegIds = new Set(licenseSnap.docs.map(d => d.data().registrationId));

                        const readyForLicenseCount = approvedRegs.filter(regId => 
                            paidRegIds.has(regId) && !licensedRegIds.has(regId)
                        ).length;

                        setAdminUnreadCounts(p => ({ ...p, License: readyForLicenseCount }));
                    });
                });
            });
        }),
        onSnapshot(adminNotificationsQuery, snapshot => setAdminUnreadCounts(p => ({ ...p, Notifications: snapshot.size })))
      ];

      return () => unsubs.forEach(unsub => unsub());
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
        if (role === 'admin' && item.label !== 'Dashboard') {
            const category = item.label as keyof Omit<UnreadCounts, 'Notifications'>;
            count = adminUnreadCounts[category] || 0;
        } else if (role === 'fisherfolk') {
            if (item.label === 'Notifications') count = fisherfolkUnreadCounts.notifications;
            if (item.label === 'My Registrations') count = fisherfolkUnreadCounts.registrations;
            if (item.label === 'Payments') count = fisherfolkUnreadCounts.payments;
            if (item.label === 'Licenses') count = fisherfolkUnreadCounts.licenses;
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
