
'use client';
import { useContext } from 'react';
// Correct the path based on your file structure
// Assuming auth-context.tsx is in src/contexts/
import { AuthContext } from '@/contexts/auth-context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
