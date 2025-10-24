
'use client';

import { cn } from '@/lib/utils';
import { ScanSearch, Files, Wallet } from 'lucide-react';

type AdminRoleToggleProps = {
  active: 'mao' | 'mto' | 'mao_inspector';
  onMaoClick: () => void;
  onMtoClick: () => void;
  onInspectorClick: () => void;
};

export function AdminRoleToggle({ active, onMaoClick, onMtoClick, onInspectorClick }: AdminRoleToggleProps) {
  const activeIndex = active === 'mao' ? 0 : active === 'mto' ? 1 : 2;
  
  return (
    <div className="relative flex w-full max-w-sm rounded-full border border-input p-1">
      <div
        className={cn(
          'absolute top-1 h-10 w-[calc(33.33%-0.25rem)] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-in-out',
        )}
        style={{ transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 0.1}rem))` }}
      />
      <button
        onClick={onMaoClick}
        className={cn(
          'z-10 flex-1 rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2',
          active === 'mao' ? 'text-white' : 'text-foreground'
        )}
      >
        <Files className="h-4 w-4" /> MAO
      </button>
      <button
        onClick={onMtoClick}
        className={cn(
          'z-10 flex-1 rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2',
          active === 'mto' ? 'text-white' : 'text-foreground'
        )}
      >
        <Wallet className="h-4 w-4" /> MTO
      </button>
      <button
        onClick={onInspectorClick}
        className={cn(
          'z-10 flex-1 rounded-full py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2',
          active === 'mao_inspector' ? 'text-white' : 'text-foreground'
        )}
      >
        <ScanSearch className="h-4 w-4" /> Inspector
      </button>
    </div>
  );
}
