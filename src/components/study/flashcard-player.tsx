"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import type { GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";

interface FlashcardPlayerProps {
  flashcards: GenerateFlashcardsOutput['flashcards'];
  onComplete: (pointsEarned: number, correctAnswers: number, totalAnswers: number) => void;
  onExit: () => void;
}

export function FlashcardPlayer({ flashcards, onComplete, onExit }: FlashcardPlayerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [points, setPoints] = useState(0);
  const [answers, setAnswers] = useState<Array<'correct' | 'incorrect' | null>>(new Array(flashcards.length).fill(null));
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers[currentIndex] !== null ? 1:0)) / flashcards.length) * 100;

  useEffect(() => {
    setIsFlipped(false); // Reset flip state when card changes
    setShowFeedback(null);
  }, [currentIndex]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (knewIt: boolean) => {
    if (answers[currentIndex] !== null) return; // Already answered

    const newAnswers = [...answers];
    newAnswers[currentIndex] = knewIt ? 'correct' : 'incorrect';
    setAnswers(newAnswers);
    
    setShowFeedback(knewIt ? 'correct' : 'incorrect');

    if (knewIt) {
      setPoints(prevPoints => prevPoints + 10);
    }

    // Automatically move to next card or complete after a short delay
    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const correctCount = newAnswers.filter(a => a === 'correct').length;
        onComplete(knewIt ? points + 10 : points, correctCount, flashcards.length);
      }
    }, 1500);
  };
  
  const navigateCard = (direction: 'next' | 'prev') => {
    setShowFeedback(null);
    if (direction === 'next' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentFlashcard) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader><CardTitle>Loading Flashcards...</CardTitle></CardHeader>
        <CardContent><p>Please wait.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>Flashcards ({currentIndex + 1}/{flashcards.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </div>
        <Progress value={progress} className="w-full h-2" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center min-h-[250px] relative">
        <div 
          className={`relative w-full h-full p-6 border rounded-lg shadow-md cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          onClick={handleFlip}
          style={{ perspective: '1000px' }}
          data-ai-hint="flashcard content"
        >
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-card p-6 backface-hidden">
            <p className="text-xl text-center">{currentFlashcard.front}</p>
          </div>
          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-card p-6 rotate-y-180 backface-hidden">
            <p className="text-xl text-center">{currentFlashcard.back}</p>
          </div>
        </div>
        {showFeedback && (
          <div className={`absolute top-2 right-2 p-2 rounded-full ${showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {showFeedback === 'correct' ? <CheckCircle className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-6">
        <div className="flex justify-center w-full">
          <Button onClick={handleFlip} variant="outline" className="gap-2">
            <RotateCcw className="h-5 w-5" /> Flip Card
          </Button>
        </div>
        {isFlipped && answers[currentIndex] === null && (
          <div className="flex justify-around w-full gap-4">
            <Button onClick={() => handleAnswer(false)} variant="destructive" className="flex-1 text-lg py-6 gap-2">
              <XCircle/> Didn't Know
            </Button>
            <Button onClick={() => handleAnswer(true)} className="bg-green-500 hover:bg-green-600 text-white flex-1 text-lg py-6 gap-2">
              <CheckCircle/> Knew It!
            </Button>
          </div>
        )}
         {answers[currentIndex] !== null && (
          <p className={`text-center font-semibold ${answers[currentIndex] === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {answers[currentIndex] === 'correct' ? "Marked as: Knew It (+10 points)" : "Marked as: Didn't Know"}
          </p>
        )}
        <div className="flex justify-between w-full mt-2">
            <Button onClick={() => navigateCard('prev')} disabled={currentIndex === 0} variant="outline" className="gap-2">
                <ArrowLeft className="h-5 w-5" /> Prev
            </Button>
            <Button onClick={() => navigateCard('next')} disabled={currentIndex === flashcards.length - 1 || answers[currentIndex] === null} variant="outline" className="gap-2">
                Next <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Helper CSS for 3D flip effect (ensure tailwind.config.js has `require('tailwindcss-animate')`)
// Add to globals.css if not using a plugin that handles this:
// .transform-style-preserve-3d { transform-style: preserve-3d; }
// .rotate-y-180 { transform: rotateY(180deg); }
// .backface-hidden { backface-visibility: hidden; }
// These are usually available with Tailwind or can be custom utilities.
// For simplicity, assuming these utilities are available or add them.
// The provided shadcn/tailwind config has animate, but these specific 3d transforms might need explicit add.
// They are standard CSS properties, so Tailwind should support them via arbitrary values if not direct classes.
// For now, using inline styles for key 3D properties.
// It's better to add these to globals.css as utility classes.

// In globals.css:
// @layer utilities {
//   .transform-style-preserve-3d {
//     transform-style: preserve-3d;
//   }
//   .rotate-y-180 {
//     transform: rotateY(180deg);
//   }
//   .backface-hidden {
//     backface-visibility: hidden;
//   }
// }
// Then use these classes in the component.
// For this exercise, I will assume these are globally available or will be handled by Tailwind's JIT.
// Shadcn animation keyframes are for accordion, not generic 3D transforms.
