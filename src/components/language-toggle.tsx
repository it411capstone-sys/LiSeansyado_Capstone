
'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const [language, setLanguage] = useState('English');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setLanguage('English')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setLanguage('Surigaonon')}>
          Surigaonon
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
