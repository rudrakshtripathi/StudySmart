"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ArrowRight, HelpCircle } from "lucide-react";
import type { GenerateMcqQuizOutput } from "@/ai/flows/generate-mcq-quiz";
import { cn } from "@/lib/utils";

interface QuizPlayerProps {
  quiz: GenerateMcqQuizOutput['quiz'];
  onComplete: (pointsEarned: number, correctAnswers: number, totalAnswers: number) => void;
  onExit: () => void;
  onIncrementPoints: (amount: number) => void;
}

export function QuizPlayer({ quiz, onComplete, onExit, onIncrementPoints }: QuizPlayerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionPoints, setSessionPoints] = useState(0); // Renamed from points
  const [answersSubmitted, setAnswersSubmitted] = useState(0);
  const [questionKey, setQuestionKey] = useState(0); // For animating question transition

  const currentQuestion = quiz[currentIndex];
  const progress = (answersSubmitted / quiz.length) * 100;

  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setQuestionKey(prev => prev + 1); // Trigger animation for new question
  }, [currentIndex]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setAnswersSubmitted(prev => prev + 1);

    if (correct) {
      const pointsToAward = 10;
      setSessionPoints(prevPoints => prevPoints + pointsToAward);
      onIncrementPoints(pointsToAward); // Increment global points
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      const correctAnswersCount = Math.round(sessionPoints / 10); // Calculate correct answers from sessionPoints
      onComplete(sessionPoints, correctAnswersCount, quiz.length);
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl animate-pop-in">
        <CardHeader><CardTitle>Loading Quiz...</CardTitle></CardHeader>
        <CardContent><p>Please wait.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border-2 border-primary/10 rounded-xl animate-pop-in overflow-hidden">
      <CardHeader className="bg-primary/5" key={questionKey}> {/* Key for animation */}
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="flex items-center gap-2 text-primary animate-question-slide-in">
            <HelpCircle className="h-6 w-6"/>
            Quiz ({currentIndex + 1}/{quiz.length})
          </CardTitle>
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
                isSubmitted && selectedAnswer !== option && option === currentQuestion.answer ? 'opacity-70' : '', // Dim unselected correct answer
                isSubmitted && selectedAnswer !== option && option !== currentQuestion.answer ? 'opacity-50' : '', // Dim other unselected options
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
        {isSubmitted && (
          <div className={cn(`flex items-center gap-2 p-3 rounded-md w-full justify-center animate-pop-in`, isCorrect ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-red-500/20 text-red-700 dark:text-red-400')}>
            {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span className="font-semibold text-lg">
              {isCorrect ? 'Correct! +10 points' : `Incorrect. The correct answer is: ${currentQuestion.answer}`}
            </span>
          </div>
        )}
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full text-lg py-6 transition-transform hover:scale-105 active:scale-95">
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