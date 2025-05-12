
"use client";

import { useState, useEffect } from 'react'; // Added useState and useEffect
import { LogoIcon } from '@/components/icons/logo-icon';
import { Award, UserCircle } from 'lucide-react';

interface AppHeaderProps {
  points: number;
  userName?: string | null;
}

const FULL_TAGLINE = "Your AI-powered learning companion... smarter every step!";

export function AppHeader({ points, userName }: AppHeaderProps): JSX.Element {
  const [typedTagline, setTypedTagline] = useState("");
  const [taglineCursorVisible, setTaglineCursorVisible] = useState(true);

  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < FULL_TAGLINE.length) {
        setTypedTagline((prev) => prev + FULL_TAGLINE.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        // Optional: Make cursor stop blinking or hide after typing is done
        // For example, by setting a timeout to change taglineCursorVisible
        // setTimeout(() => setTaglineCursorVisible(false), 2000); 
      }
    }, 75); // Adjust typing speed here (milliseconds per character)

    const cursorBlinkInterval = setInterval(() => {
        setTaglineCursorVisible(vis => !vis);
    }, 530); // Cursor blink speed

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorBlinkInterval);
    };
  }, []);

  return (
    <header className="py-4 px-6 shadow-md bg-card sticky top-0 z-50 animate-slide-in-from-top">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section: Logo and Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <LogoIcon className="h-10 w-10 text-primary animate-pop-in" /> {/* Increased size from h-8 w-8 */}
          <h1 className="text-2xl font-bold text-primary animate-fade-in delay-200">StudySmart</h1>
        </div>

        {/* Center Section: Animated Tagline */}
        <div className="flex-grow text-center px-4 hidden md:block min-w-0"> {/* Hide on small screens, min-w-0 to prevent overflow issues */}
          <p className="text-base text-muted-foreground animate-fade-in delay-500 truncate"> {/* Changed from text-sm to text-base, truncate added to prevent text wrapping issues */}
            {typedTagline}
            <span className={`transition-opacity duration-150 ${taglineCursorVisible ? 'opacity-100' : 'opacity-0'}`}>|</span>
          </p>
        </div>

        {/* Right Section: User Info and Points */}
        <div className="flex items-center gap-4 flex-shrink-0">
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

