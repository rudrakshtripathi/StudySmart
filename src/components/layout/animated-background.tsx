
"use client";

import { useEffect, useState } from 'react';
import { BookOpen, Brain, FlaskConical, Lightbulb, BarChart3, Star, Sparkles } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface FloatingIconData {
  id: string;
  IconComponent: React.FC<LucideProps>;
  style: React.CSSProperties;
  size: number;
}

const iconTypes = [
  { component: BookOpen, baseSize: 36, hint: "book" },
  { component: Brain, baseSize: 40, hint: "brain" },
  { component: FlaskConical, baseSize: 32, hint: "flask" },
  { component: Lightbulb, baseSize: 38, hint: "idea" },
  { component: BarChart3, baseSize: 34, hint: "chart" },
  { component: Star, baseSize: 28, hint: "star" },
  { component: Sparkles, baseSize: 30, hint: "sparkle" },
];
const TOTAL_ICONS = 20; // Increased total icons for more density with new types

export function AnimatedBackground(): JSX.Element {
  const [floatingIcons, setFloatingIcons] = useState<FloatingIconData[]>([]);

  useEffect(() => {
    const generateIcon = (index: number): FloatingIconData => {
      const selectedIconType = iconTypes[index % iconTypes.length];
      const duration = Math.random() * 20 + 25; // 25s to 45s for even slower, more subtle movement
      const delay = Math.random() * 25;         // 0s to 25s
      const scaleMultiplier = Math.random() * 0.25 + 0.85; // 0.85 to 1.1 for slight size variation
      const initialScale = scaleMultiplier;

      return {
        id: `icon-${index}-${Math.random().toString(36).substring(7)}`,
        IconComponent: selectedIconType.component,
        style: {
          top: `${Math.random() * 95}%`,
          left: `${Math.random() * 95}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--initial-scale': initialScale,
        } as React.CSSProperties,
        size: selectedIconType.baseSize * (Math.random() * 0.3 + 0.7), // Vary base size by +/- 15% for more subtlety
      };
    };

    const newIconsList: FloatingIconData[] = Array.from({ length: TOTAL_ICONS }, (_, i) => generateIcon(i));
    setFloatingIcons(newIconsList);
  }, []);

  if (floatingIcons.length === 0) {
    // Return null to prevent attempting to render icons on the server or before client-side generation
    return null; 
  }

  return (
    <div className="fixed inset-0 z-[-5] overflow-hidden pointer-events-none" aria-hidden="true" data-ai-hint="animated icons background stars sparkles">
      {floatingIcons.map(({ id, IconComponent, style, size }) => (
        <IconComponent
          key={id}
          className="floating-icon absolute text-primary" // Color from primary, opacity controlled by animation
          style={style}
          size={size}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

