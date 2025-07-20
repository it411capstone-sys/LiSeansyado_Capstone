
'use client';

import { cn } from '@/lib/utils';

type AuthToggleProps = {
  active: 'login' | 'signup';
  onLoginClick: () => void;
  onSignupClick: () => void;
};

export function AuthToggle({ active, onLoginClick, onSignupClick }: AuthToggleProps) {
  return (
    <div className="relative flex w-full max-w-xs rounded-full border border-input p-1">
      <div
        className={cn(
          'absolute top-1 left-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-primary to-accent transition-transform duration-300 ease-in-out',
          active === 'signup' && 'translate-x-[calc(100%-0.1rem)]'
        )}
      />
      <button
        onClick={onLoginClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'login' ? 'text-white' : 'text-foreground'
        )}
      >
        Login
      </button>
      <button
        onClick={onSignupClick}
        className={cn(
          'z-10 w-1/2 rounded-full py-2.5 text-sm font-medium transition-colors',
          active === 'signup' ? 'text-white' : 'text-foreground'
        )}
      >
        Signup
      </button>
    </div>
  );
}
