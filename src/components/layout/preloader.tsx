// src/components/layout/preloader.tsx
"use client";

import { useEffect, useState } from 'react';

export function Preloader(): JSX.Element {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="preloader mb-12">
        <div className="preloader__square"></div>
        <div className="preloader__square"></div>
        <div className="preloader__square"></div>
        <div className="preloader__square"></div>
      </div>
      <div className="status text-2xl font-semibold">
        Loading<span className="status__dot">{'.'.repeat(dotCount)}</span>
      </div>
      <style jsx global>{`
        :root {
          --preloader-fg: hsl(var(--foreground));
          --preloader-bg: hsl(var(--background));
          --preloader-shade1: hsl(var(--muted)); /* Approximation */
          --preloader-shade2: hsl(var(--border)); /* Approximation */
          --preloader-shade3: hsl(var(--card)); /* Approximation */
          --preloader-shade4: hsl(var(--popover)); /* Approximation */
          --preloader-dur1: 1s;
          --preloader-dur2: 6s;
        }
        
        .preloader {
          animation: largePopOut var(--preloader-dur1) linear;
          border-radius: 50%;
          box-shadow:
            0.15em 0.15em 0.15em var(--preloader-shade4) inset,
            -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
            1em 1em 2em var(--preloader-shade1), 
            -1em -1em 2em var(--preloader-shade4);
          margin-bottom: 3em;
          position: relative;
          width: 12em;
          height: 12em;
        }
        .preloader__square {
          animation: smallPopOut1 var(--preloader-dur1) linear, popInOut var(--preloader-dur2) var(--preloader-dur1) linear infinite;
          border-radius: 0.5em;
          background-color: hsl(var(--primary) / 0.5); /* Make squares visible against theme */
          box-shadow:
            0.15em 0.15em 0.15em var(--preloader-shade4) inset,
            -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
            0.25em 0.25em 0.5em var(--preloader-shade1),
            -0.25em -0.25em 0.5em var(--preloader-shade4);
          position: absolute;
          top: 2.5em;
          left: 2.5em;
          width: 3em;
          height: 3em;
        }
        .preloader__square:nth-child(n + 2):nth-child(-n + 3) {
          left: 6.5em;
        }
        .preloader__square:nth-child(n + 3) {
          top: 6.5em;
        }
        .preloader__square:nth-child(2) {
          animation: smallPopOut2 var(--preloader-dur1) linear, move2 var(--preloader-dur2) var(--preloader-dur1) linear infinite;
        }
        .preloader__square:nth-child(3) {
          animation: smallPopOut3 var(--preloader-dur1) linear, move3 var(--preloader-dur2) var(--preloader-dur1) linear infinite;
        }
        .preloader__square:nth-child(4) {
          animation: smallPopOut4 var(--preloader-dur1) linear, move4 var(--preloader-dur2) var(--preloader-dur1) linear infinite;
        }
        .status {
          animation: fadeIn var(--preloader-dur1) linear forwards;
          text-align: center;
        }
        
        /* Animations */
        @keyframes largePopOut {
          from, 20% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1), 
              0 0 0 var(--preloader-shade4);
          }
          40% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              2em 2em 2em var(--preloader-shade1), 
              -2em -2em 4em var(--preloader-shade4);
          }
          60%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              1em 1em 2em var(--preloader-shade1), 
              -1em -1em 2em var(--preloader-shade4);
          }
        }
        @keyframes smallPopOut1 {
          from, 40% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1), 
              0 0 0 var(--preloader-shade4);
          }
          60% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
          }
          80%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
          }
        }

        @keyframes smallPopOut2 {
          from, 45% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1), 
              0 0 0 var(--preloader-shade4);
          }
          65% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
          }
          85%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
          }
        }

        @keyframes smallPopOut3 {
          from, 50% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1), 
              0 0 0 var(--preloader-shade4);
          }
          70% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
          }
          90%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
          }
        }

        @keyframes smallPopOut4 {
          from, 55% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1), 
              0 0 0 var(--preloader-shade4);
          }
          75% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
          }
          95%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
          }
        }
        @keyframes popInOut {
          from {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
            transform: translate(0,0);
          }
          4% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(0,0);
          }
          8% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(0,0);
          }
          12%, 16% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(4em,0);
          }
          20% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(4em,0);
          }
          24%, 25% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
            transform: translate(4em,0);
          }
          29% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(4em,0);
          }
          33% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(4em,0);
          }
          37%, 41% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(4em,4em);
          }
          45% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(4em,4em);
          }
          49%, 50% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
            transform: translate(4em,4em);
          }
          54% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(4em,4em);
          }
          58% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(4em,4em);
          }
          62%, 66% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(0,4em);
          }
          70% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(0,4em);
          }
          74%, 75% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
            transform: translate(0,4em);
          }
          79% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(0,4em);
          }
          83% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(0,4em);
          }
          87%, 91% {
            box-shadow:
              0 0 0 var(--preloader-shade4) inset,
              0 0 0 var(--preloader-shade1) inset,
              0 0 0 var(--preloader-shade1),
              0 0 0 var(--preloader-shade4);
            transform: translate(0,0);
          }
          95% {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.5em 0.5em 0.5em var(--preloader-shade1),
              -0.5em -0.5em 1em var(--preloader-shade4);
            transform: translate(0,0);
          }
          99%, to {
            box-shadow:
              0.15em 0.15em 0.15em var(--preloader-shade4) inset,
              -0.15em -0.15em 0.15em var(--preloader-shade1) inset,
              0.25em 0.25em 0.5em var(--preloader-shade1),
              -0.25em -0.25em 0.5em var(--preloader-shade4);
            transform: translate(0,0);
          }
        }
        @keyframes move2 {
          from, 8% {
            transform: translate(0,0);
            width: 3em;
            height: 3em;
          }
          12% {
            transform: translate(-4em,0);
            width: 7em;
            height: 3em;
          }
          16%, 83% {
            transform: translate(-4em,0);
            width: 3em;
            height: 3em;
          }
          87% {
            transform: translate(-4em,0);
            width: 3em;
            height: 7em;
          }
          91%, to {
            transform: translate(-4em,4em);
            width: 3em;
            height: 3em;
          }
        }
        @keyframes move3 {
          from, 33% {
            transform: translate(0,0);
            height: 3em;
          }
          37% {
            transform: translate(0,-4em);
            height: 7em;
          }
          41%, to {
            transform: translate(0,-4em);
            height: 3em;
          }
        }
        @keyframes move4 {
          from, 58% {
            transform: translate(0,0);
            width: 3em;
          }
          62% {
            transform: translate(0,0);
            width: 7em;
          }
          66%, to {
            transform: translate(4em,0);
            width: 3em;
          }
        }
        @keyframes fadeIn {
          from, 67% {
            opacity: 0;
          }
          83.3%, to {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
