

'use client';
import { PaymentsClient } from '@/components/admin/payments-client';
import { useAuth } from '@/hooks/use-auth';
import { AuditLogAction } from '@/lib/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect } from 'react';

const createAuditLog = async (userId: string, userName: string, action: AuditLogAction, targetId: string, details?: any) => {
    try {
        await addDoc(collection(db, "auditLogs"), {
            timestamp: new Date(),
            userId: userId,
            userName: userName,
            action: action,
            target: {
                type: 'payment',
                id: targetId,
            },
            details: details || {}
        });
    } catch (error) {
        console.error("Error writing audit log: ", error);
    }
};

export default function AdminPaymentsPage() {
    const { user, userData } = useAuth();
    useEffect(() => {
        if (user && userData) {
            createAuditLog(user.uid, userData.displayName, 'ADMIN_PAGE_VIEW', 'payments');
        }
    }, [user, userData]);

    return <PaymentsClient role="admin" />
}
