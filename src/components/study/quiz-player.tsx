
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ArrowRight, HelpCircle, TimerIcon } from "lucide-react";
import type { GenerateMcqQuizOutput } from "@/ai/flows/generate-mcq-quiz";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  quiz: GenerateMcqQuizOutput['quiz'];
  onComplete: (pointsEarned: number, correctAnswers: number, totalAnswers: number) => void;
  onExit: () => void;
  onIncrementPoints: (amount: number) => void;
}

const QUESTION_TIME_LIMIT = 10; // seconds

export function QuizPlayer({ quiz, onComplete, onExit, onIncrementPoints }: QuizPlayerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [submissionType, setSubmissionType] = useState<'manual' | 'timeout' | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = quiz[currentIndex];
  const progress = (answersSubmitted / quiz.length) * 100;

  // Effect to reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setQuestionKey(prev => prev + 1);
    setSubmissionType(null);
    // Timer reset is handled in the timer useEffect
  }, [currentIndex]);

  // Timer effect
  useEffect(() => {
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (isSubmitted || !currentQuestion) {
      return; // Stop if submitted or no question
    }

    setTimeLeft(QUESTION_TIME_LIMIT); // Reset timer for the new question

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
          handleSubmitInternal(true); // Auto-submit on timeout
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [currentIndex, currentQuestion, isSubmitted]); // Rerun when question changes or submission status changes


  const handleSubmitInternal = (isTimeout: boolean = false) => {
    if (!isTimeout && !selectedAnswer) return; // Manual submit requires an answer

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    setSubmissionType(isTimeout ? 'timeout' : 'manual');

    const answerIsCorrect = selectedAnswer === currentQuestion.answer;
    // If timeout and no answer selected, it's incorrect. Otherwise, rely on actual check.
    const finalCorrectStatus = isTimeout && !selectedAnswer ? false : answerIsCorrect;

    setIsCorrect(finalCorrectStatus);
    setIsSubmitted(true);
    setAnswersSubmitted(prev => prev + 1);

    if (finalCorrectStatus) {
      const pointsToAward = 10;
      setSessionPoints(prevPoints => prevPoints + pointsToAward);
      onIncrementPoints(pointsToAward);
    }
  };
  
  const handleManualSubmit = () => {
     handleSubmitInternal(false);
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      const correctAnswersCount = Math.round(sessionPoints / 10);
      onComplete(sessionPoints, correctAnswersCount, quiz.length);
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-xl animate-pop-in">
        <CardHeader><CardTitle>Loading Quiz...</CardTitle></CardHeader>
        <CardContent><p>Please wait.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-2 border-primary/10 rounded-xl animate-pop-in overflow-hidden">
      <CardHeader className="bg-primary/5" key={questionKey}>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="flex items-center gap-2 text-primary animate-question-slide-in">
            <HelpCircle className="h-6 w-6"/>
            Quiz ({currentIndex + 1}/{quiz.length})
          </CardTitle>
           {!isSubmitted && currentQuestion && (
            <div className={cn(
              "flex items-center gap-1 text-lg font-semibold",
              timeLeft <= 5 && timeLeft > 0 ? "text-destructive animate-pulse" : "text-primary",
              timeLeft === 0 ? "text-destructive" : ""
            )}>
              <TimerIcon className="h-5 w-5" />
              <span>{timeLeft}s</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onExit} className="hover:bg-primary/10 transition-colors">Exit</Button>
        </div>
        <Progress value={progress} className="w-full h-3 bg-primary/20 [&>div]:bg-primary transition-all duration-500 animate-question-slide-in delay-100" />
        <CardDescription className="pt-4 text-lg font-semibold animate-question-slide-in delay-200">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent className="animate-question-slide-in delay-300" key={`content-${questionKey}`}>
        <RadioGroup
          value={selectedAnswer ?? undefined}
          onValueChange={setSelectedAnswer}
          disabled={isSubmitted}
          className="space-y-3"
        >
          {currentQuestion.options.map((option, index) => (
            <Label
              key={index}
              htmlFor={`option-${index}`}
              className={cn(`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md`,
                selectedAnswer === option && !isSubmitted ? 'ring-2 ring-primary border-primary scale-105 shadow-lg animate-option-select' : 'border-border',
                isSubmitted && option === currentQuestion.answer ? 'bg-green-500/20 border-green-500 ring-2 ring-green-500 scale-105' : '',
                isSubmitted && selectedAnswer === option && option !== currentQuestion.answer ? 'bg-red-500/20 border-red-500 ring-2 ring-red-500 animate-shake' : '',
                isSubmitted && selectedAnswer !== option && option === currentQuestion.answer ? 'opacity-70' : '', 
                isSubmitted && selectedAnswer !== option && option !== currentQuestion.answer ? 'opacity-50' : '', 
                'hover:border-primary/70'
              )}
              data-ai-hint="quiz option"
            >
              <RadioGroupItem value={option} id={`option-${index}`} className="h-5 w-5"/>
              <span className="text-base">{option}</span>
               {isSubmitted && option === currentQuestion.answer && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
               {isSubmitted && selectedAnswer === option && option !== currentQuestion.answer && <XCircle className="h-5 w-5 text-red-600 ml-auto" />}
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 pt-6 bg-primary/5">
        {isSubmitted && submissionType && (
          <div className={cn(`flex items-center gap-2 p-3 rounded-md w-full justify-center animate-pop-in`, isCorrect ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400')}>
            {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span className="font-semibold text-lg text-center">
              {isCorrect ? 'Correct! +10 points' :
                (submissionType === 'timeout' && !selectedAnswer 
                  ? `Time's up! The correct answer was: ${currentQuestion.answer}`
                  : `Incorrect. The correct answer is: ${currentQuestion.answer}`
                )
              }
            </span>
          </div>
        )}
        {!isSubmitted ? (
          <Button onClick={handleManualSubmit} disabled={!selectedAnswer || timeLeft === 0} className="w-full text-lg py-6 transition-transform hover:scale-105 active:scale-95">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 gap-2 transition-transform hover:scale-105 active:scale-95 animate-pop-in delay-200">
            {currentIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight/>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

