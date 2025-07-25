
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Checklist, Inspection } from '@/lib/types';
import { format } from 'date-fns';

interface InspectionsContextType {
  inspections: Inspection[];
  setInspections: React.Dispatch<React.SetStateAction<Inspection[]>>;
  addInspection: (inspection: Omit<Inspection, 'id' | 'status' | 'checklist' | 'inspectorNotes' | 'photos'>) => void;
  updateInspection: (id: string, updates: Partial<Inspection>) => void;
}

const InspectionsContext = createContext<InspectionsContextType | undefined>(undefined);

export const InspectionsProvider = ({ children }: { children: ReactNode }) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const addInspection = (inspectionData: Omit<Inspection, 'id' | 'status' | 'checklist' | 'inspectorNotes' | 'photos'>) => {
    const newInspection: Inspection = {
      ...inspectionData,
      id: `INSP-${String(inspections.length + 1).padStart(3, '0')}`,
      status: 'Scheduled',
      checklist: null,
      inspectorNotes: null,
      photos: null,
    };
    setInspections(prev => [newInspection, ...prev]);
  };

  const updateInspection = (id: string, updates: Partial<Inspection>) => {
    setInspections(prev =>
      prev.map(inspection =>
        inspection.id === id ? { ...inspection, ...updates } : inspection
      )
    );
  };

  return (
    <InspectionsContext.Provider value={{ inspections, setInspections, addInspection, updateInspection }}>
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
