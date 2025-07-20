// src/components/auth-toggle.tsx
'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type AuthToggleProps = {
  active: 'login' | 'signup';
};

export function AuthToggle({ active }: AuthToggleProps) {
  return (
    <div className="relative flex w-full max-w-xs rounded-full border border-input p-1">
      <div
        className={cn(
          'absolute top-1 left-1 h-10 w-[calc(50%-0.25rem)] rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-transform duration-300 ease-in-out',
          active === 'signup' && 'translate-x-[calc(100%-0.1rem)]'
        )}
      />
      <Link href="/login/fisherfolk" className="z-10 w-1/2">
        <button
          className={cn(
            'w-full rounded-full py-2.5 text-sm font-medium transition-colors',
            active === 'login' ? 'text-white' : 'text-foreground'
          )}
        >
          Login
        </button>
      </Link>
      <Link href="/register" className="z-10 w-1/2">
        <button
          className={cn(
            'w-full rounded-full py-2.5 text-sm font-medium transition-colors',
            active === 'signup' ? 'text-white' : 'text-foreground'
          )}
        >
          Signup
        </button>
      </Link>
    </div>
  );
}
