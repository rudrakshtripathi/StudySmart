// src/components/study/flashcard-player.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, ArrowLeft, ArrowRight, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import type { GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";
import { cn } from "@/lib/utils";

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
  const [cardKey, setCardKey] = useState(0); // Used to re-trigger animation

  const currentFlashcard = flashcards[currentIndex];
  const progress = ((currentIndex + (answers[currentIndex] !== null ? 1:0)) / flashcards.length) * 100;

  useEffect(() => {
    setIsFlipped(false); 
    setShowFeedback(null);
    setCardKey(prev => prev + 1); // Change key to re-trigger entrance animation for the card content
  }, [currentIndex]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = (knewIt: boolean) => {
    if (answers[currentIndex] !== null) return; 

    const newAnswers = [...answers];
    newAnswers[currentIndex] = knewIt ? 'correct' : 'incorrect';
    setAnswers(newAnswers);
    
    setShowFeedback(knewIt ? 'correct' : 'incorrect');

    let currentPoints = points;
    if (knewIt) {
      currentPoints += 10;
      setPoints(currentPoints);
    }

    setTimeout(() => {
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const correctCount = newAnswers.filter(a => a === 'correct').length;
        onComplete(currentPoints, correctCount, flashcards.length);
      }
    }, 1500);
  };
  
  const navigateCard = (direction: 'next' | 'prev') => {
    setShowFeedback(null);
    if (direction === 'next' && currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev + 1); // This was prev => prev - 1, correcting
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentFlashcard) {
    return (
      <Card className="w-full max-w-xl mx-auto shadow-xl animate-pop-in">
        <CardHeader><CardTitle>Loading Flashcards...</CardTitle></CardHeader>
        <CardContent><p>Please wait.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-2xl flex flex-col border-2 border-primary/20 rounded-xl bg-gradient-to-br from-card to-background animate-pop-in overflow-hidden">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-6 w-6 animate-pulse-glow" />
            Flashcards ({currentIndex + 1}/{flashcards.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onExit} className="hover:bg-primary/10 transition-colors">Exit</Button>
        </div>
        <Progress value={progress} className="w-full h-3 bg-primary/20 [&>div]:bg-primary transition-all duration-500" />
      </CardHeader>
      <CardContent key={cardKey} className="flex-grow flex flex-col items-center justify-center min-h-[300px] md:min-h-[350px] relative p-4 perspective-1500 animate-fade-in-slide-up">
        <div 
          className={cn(
            "relative w-[90%] md:w-[80%] aspect-[16/10] rounded-xl shadow-2xl cursor-pointer transition-transform duration-700 transform-style-preserve-3d group hover:shadow-primary/30",
            isFlipped ? 'animate-flashcard-flip' : '' // Using custom animation for flip
          )}
          onClick={handleFlip}
          data-ai-hint="flashcard content"
          style={{ transform: isFlipped ? 'rotateY(180deg) scale(1.05)' : 'rotateY(0deg) scale(1)' }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 md:p-6 backface-hidden rounded-xl border-2 border-primary/30 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-300">
            <p className="text-lg md:text-xl font-semibold text-center text-foreground">{currentFlashcard.front}</p>
          </div>
          {/* Back of card */}
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 rotate-y-180 backface-hidden rounded-xl border-2 border-accent/30 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-300">
            <p className="text-md md:text-lg font-medium text-center text-foreground/90">{currentFlashcard.back}</p>
          </div>
        </div>
        {showFeedback && (
          <div className={`absolute top-2 right-2 p-2 rounded-full animate-pop-in ${showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {showFeedback === 'correct' ? <CheckCircle className="h-8 w-8 text-green-500" /> : <XCircle className="h-8 w-8 text-red-500" />}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-6 bg-primary/5">
        <div className="flex justify-center w-full">
          <Button onClick={handleFlip} variant="outline" className="gap-2 text-base py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 border-primary/50 hover:border-primary text-primary hover:bg-primary/10">
            <RotateCcw className="h-5 w-5" /> Flip Card
          </Button>
        </div>
        {isFlipped && answers[currentIndex] === null && (
          <div className="flex justify-around w-full gap-2 md:gap-4 animate-fade-in-slide-up">
            <Button onClick={() => handleAnswer(false)} variant="destructive" className="flex-1 text-md md:text-lg py-3 md:py-4 px-3 md:px-6 gap-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
              <XCircle/> Didn't Know
            </Button>
            <Button onClick={() => handleAnswer(true)} className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1 text-md md:text-lg py-3 md:py-4 px-3 md:px-6 gap-2 rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95">
              <CheckCircle/> Knew It!
            </Button>
          </div>
        )}
         {answers[currentIndex] !== null && (
          <p className={`text-center font-semibold text-base animate-pop-in ${answers[currentIndex] === 'correct' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {answers[currentIndex] === 'correct' ? "Marked as: Knew It (+10 points)" : "Marked as: Didn't Know"}
          </p>
        )}
        <div className="flex justify-between w-full mt-2">
            <Button onClick={() => navigateCard('prev')} disabled={currentIndex === 0} variant="outline" className="gap-2 rounded-lg transition-transform hover:scale-105 active:scale-95">
                <ArrowLeft className="h-5 w-5" /> Prev
            </Button>
            <Button onClick={() => navigateCard('next')} disabled={currentIndex === flashcards.length - 1 || answers[currentIndex] === null} variant="outline" className="gap-2 rounded-lg transition-transform hover:scale-105 active:scale-95">
                Next <ArrowRight className="h-5 w-5" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
