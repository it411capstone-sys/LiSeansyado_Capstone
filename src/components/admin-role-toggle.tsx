
'use client';

import { cn } from '@/lib/utils';

type AdminRoleToggleProps = {
  active: 'mao' | 'mto';
  onMaoClick: () => void;
  onMtoClick: () => void;
};

export function AdminRoleToggle({ active, onMaoClick, onMtoClick }: AdminRoleToggleProps) {
  return (
    <div className="relative flex w-full max-w-xs rounded-full border border-input p-1">
      <div
        className={cn(
          'absolute top-1 left-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-in-out',
          active === 'mto' && 'translate-x-[calc(100%-0.1rem)]'
        )}
      />
      <button
        onClick={onMaoClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'mao' ? 'text-white' : 'text-foreground'
        )}
      >
        MAO
      </button>
      <button
        onClick={onMtoClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'mto' ? 'text-white' : 'text-foreground'
        )}
      >
        MTO
      </button>
    </div>
  );
}
