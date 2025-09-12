
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Inspection } from '@/lib/types';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface InspectionsContextType {
  inspections: Inspection[];
  addInspection: (inspection: Omit<Inspection, 'id' | 'status' | 'checklist' | 'inspectorNotes' | 'photos'>) => Promise<void>;
  updateInspection: (id: string, updates: Partial<Inspection>) => Promise<void>;
  deleteInspection: (id: string) => Promise<void>;
}

const InspectionsContext = createContext<InspectionsContextType | undefined>(undefined);

export const InspectionsProvider = ({ children }: { children: ReactNode }) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "inspections"), orderBy("scheduledDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inspectionsData: Inspection[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        inspectionsData.push({ 
          id: doc.id,
           ...data,
           scheduledDate: data.scheduledDate.toDate()
        } as Inspection);
      });
      setInspections(inspectionsData);
    });
    return () => unsubscribe();
  }, []);

  const addInspection = async (inspectionData: Omit<Inspection, 'id' | 'status' | 'checklist' | 'inspectorNotes' | 'photos'>) => {
    try {
      await addDoc(collection(db, "inspections"), {
        ...inspectionData,
        status: 'Scheduled',
        checklist: null,
        inspectorNotes: null,
        photos: null,
      });
      toast({ title: "Inspection Scheduled", description: "The inspection has been added to the schedule." });
    } catch (error) {
      console.error("Error adding inspection: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not schedule inspection." });
    }
  };

  const updateInspection = async (id: string, updates: Partial<Inspection>) => {
    const inspectionRef = doc(db, "inspections", id);
    try {
      await updateDoc(inspectionRef, updates);
      toast({ title: "Inspection Updated", description: "The inspection details have been updated." });
    } catch (error) {
      console.error("Error updating inspection: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not update inspection." });
    }
  };

  const deleteInspection = async (id: string) => {
    const inspectionRef = doc(db, "inspections", id);
    try {
      await deleteDoc(inspectionRef);
      toast({ title: "Inspection Deleted", description: "The inspection has been removed from the schedule." });
    } catch (error) {
      console.error("Error deleting inspection: ", error);
      toast({ variant: "destructive", title: "Error", description: "Could not delete inspection." });
    }
  };

  return (
    <InspectionsContext.Provider value={{ inspections, addInspection, updateInspection, deleteInspection }}>
      {children}
    </InspectionsContext.Provider>
  );
};

export const useInspections = () => {
  const context = useContext(InspectionsContext);
  if (context === undefined) {
    throw new Error('useInspections must be used within an InspectionsProvider');
  }
  return context;
};

    