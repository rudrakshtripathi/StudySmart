
"use client";

import { LogoIcon } from '@/components/icons/logo-icon';
import { Award, UserCircle } from 'lucide-react';

interface AppHeaderProps {
  points: number;
  userName?: string | null;
}

export function AppHeader({ points, userName }: AppHeaderProps): JSX.Element {
  return (
    <header className="py-4 px-6 shadow-md bg-card sticky top-0 z-50 animate-slide-in-from-top">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-10 w-10 text-primary animate-pop-in" /> {/* Increased size from h-8 w-8 */}
          <h1 className="text-2xl font-bold text-primary animate-fade-in delay-200">StudySmart</h1>
        </div>
        <div className="flex items-center gap-4">
          {userName && (
            <div className="flex items-center gap-2 text-primary animate-fade-in delay-300">
              <UserCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">{userName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 animate-fade-in delay-400">
            <Award className="h-6 w-6" />
            <span className="text-lg font-semibold">{points} Points</span>
          </div>
        </div>
      </div>
    </header>
  );
}

