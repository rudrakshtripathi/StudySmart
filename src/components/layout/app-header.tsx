"use client";

import { LogoIcon } from '@/components/icons/logo-icon';
import { Award } from 'lucide-react';

interface AppHeaderProps {
  points: number;
}

export function AppHeader({ points }: AppHeaderProps): JSX.Element {
  return (
    <header className="py-4 px-6 shadow-md bg-card sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">StudySmart</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground shadow-sm">
          <Award className="h-6 w-6" />
          <span className="text-lg font-semibold">{points} Points</span>
        </div>
      </div>
    </header>
  );
}
