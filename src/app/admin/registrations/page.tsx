

'use client';
import { RegistrationsClient } from "@/components/admin/registrations-client";
import { useAuth } from "@/hooks/use-auth";
import { AuditLogAction } from "@/lib/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect } from "react";
import { useTranslation } from "@/contexts/language-context";

const createAuditLog = async (userId: string, userName: string, action: AuditLogAction, targetId: string, details?: any) => {
    try {
        await addDoc(collection(db, "auditLogs"), {
            timestamp: new Date(),
            userId: userId,
            userName: userName,
            action: action,
            target: {
                type: 'registration',
                id: targetId,
            },
            details: details || {}
        });
    } catch (error) {
        console.error("Error writing audit log: ", error);
    }
};

export default function AdminRegistrationsPage() {
    useTranslation();
    const { user, userData } = useAuth();

    useEffect(() => {
        if (user && userData) {
            createAuditLog(user.uid, userData.displayName, 'ADMIN_PAGE_VIEW', 'registrations');
        }
    }, [user, userData]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <RegistrationsClient />
    </div>
  );
}

    
