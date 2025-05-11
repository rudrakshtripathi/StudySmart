import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  // The `text-primary` class on the parent component (AppHeader) where this icon is used
  // will set `currentColor` to be `hsl(var(--primary))`.
  // We use `currentColor` for the fill of the main letter 'R'.
  // Other colors are derived from theme variables or are fixed for contrast.
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      // strokeWidth, fill, stroke are set on individual elements or inherited via props
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props} // Allows overriding fill, stroke, className, etc.
    >
      {/* Document with "PDF" label. Base color from card, PDF tag destructive. */}
      <rect x="2" y="3" width="11" height="15" rx="1.5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1"/>
      <rect x="3" y="4.5" width="4.5" height="3" rx="0.5" fill="hsl(var(--destructive))" stroke="none" />
      <text x="5.25" y="6.9" fill="hsl(var(--destructive-foreground))" fontSize="1.8" textAnchor="middle" fontWeight="bold" stroke="none" dominantBaseline="middle">PDF</text>

      {/* Brain (simplified) & Cap. Primary for brain, foreground for cap. */}
      <path
        d="M17.5 9 C15.5 9 14.5 10.5 14.5 12 C14.5 13.5 15.5 15 17.5 15 C19.5 15 20.5 13.5 20.5 12 C20.5 10.5 19.5 9 17.5 9 Z M17.5 9.5 A2.25 2.25 0 0 0 15.25 12 A2.25 2.25 0 0 0 17.5 14.5 A2.25 2.25 0 0 0 19.75 12 A2.25 2.25 0 0 0 17.5 9.5 Z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="0.5"
        opacity="0.9"
      />
      {/* Lightbulb idea in brain */}
      <circle cx="17.5" cy="12" r="0.75" fill="hsl(var(--accent))" stroke="none" />
      
      <polygon points="15.5,8.5 19.5,8.5 17.5,6" fill="hsl(var(--foreground))" stroke="hsl(var(--foreground))" strokeWidth="0.5"/>
      <line x1="15" y1="8.4" x2="20" y2="8.4" stroke="hsl(var(--foreground))" strokeWidth="0.75"/>
      
      {/* Central 'R', uses currentColor for its fill (which will be --primary from className context) */}
      <text
        x="9"
        y="17.5" /* Adjusted y for better baseline alignment */
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="12" // Large R
        fontWeight="bold"
        fill="currentColor" // This will take color from text-primary in AppHeader
        stroke="hsl(var(--card))" // Outline for R, using card color for contrast
        strokeWidth="0.4"
        textAnchor="middle"
        dominantBaseline="alphabetic"
      >
        R
      </text>
    </svg>
  );
}
