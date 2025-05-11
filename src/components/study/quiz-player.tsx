"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import type { GenerateMcqQuizOutput } from "@/ai/flows/generate-mcq-quiz";

interface QuizPlayerProps {
  quiz: GenerateMcqQuizOutput['quiz'];
  onComplete: (pointsEarned: number, correctAnswers: number, totalAnswers: number) => void;
  onExit: () => void;
}

export function QuizPlayer({ quiz, onComplete, onExit }: QuizPlayerProps): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [points, setPoints] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState(0);

  const currentQuestion = quiz[currentIndex];
  const progress = (answersSubmitted / quiz.length) * 100;

  useEffect(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  }, [currentIndex]);

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.answer;
    setIsCorrect(correct);
    setIsSubmitted(true);
    setAnswersSubmitted(prev => prev + 1);

    if (correct) {
      setPoints(prevPoints => prevPoints + 10);
    }
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // const correctCount = quiz.reduce((acc, q, index) => {
        // This needs a way to track which answers were correct.
        // For now, let's assume `isCorrect` reflects the last answer's status
        // This part is tricky without storing all answers. Let's simplify.
        // The points variable tracks earned points.
        // We need a better way to count correct answers for the summary.
        // Let's pass only points for now. A more robust solution would store all responses.
        // For this version: we can count based on which questions resulted in point increase
        // but that's also indirect.
        // Let's calculate correct answers by re-evaluating (not ideal but works for this scope)
        // Or, even better, maintain an array of results.
        // For simplicity, let's not pass correctAnswers if it complicates this component too much.
        // The onComplete can be simplified for now.
        // onComplete(points, correctAnswersThisSession, totalAnswers)
        // This means points IS the correct answers count * 10.
         onComplete(points, points / 10, quiz.length);
      // }
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader><CardTitle>Loading Quiz...</CardTitle></CardHeader>
        <CardContent><p>Please wait.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle>Quiz ({currentIndex + 1}/{quiz.length})</CardTitle>
          <Button variant="ghost" size="sm" onClick={onExit}>Exit</Button>
        </div>
        <Progress value={progress} className="w-full h-2" />
        <CardDescription className="pt-4 text-lg font-semibold">{currentQuestion.question}</CardDescription>
      </CardHeader>
      <CardContent>
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
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out
                ${selectedAnswer === option ? 'ring-2 ring-primary border-primary' : 'border-border'}
                ${isSubmitted && option === currentQuestion.answer ? 'bg-green-500/20 border-green-500' : ''}
                ${isSubmitted && selectedAnswer === option && option !== currentQuestion.answer ? 'bg-red-500/20 border-red-500' : ''}
                hover:border-primary/70
              `}
              data-ai-hint="quiz option"
            >
              <RadioGroupItem value={option} id={`option-${index}`} className="h-5 w-5"/>
              <span className="text-base">{option}</span>
            </Label>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex flex-col items-center gap-4 pt-6">
        {isSubmitted && (
          <div className={`flex items-center gap-2 p-3 rounded-md w-full justify-center ${isCorrect ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
            {isCorrect ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span className="font-semibold text-lg">
              {isCorrect ? 'Correct! +10 points' : `Incorrect. The correct answer is: ${currentQuestion.answer}`}
            </span>
          </div>
        )}
        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswer} className="w-full text-lg py-6">
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 gap-2">
            {currentIndex < quiz.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight/>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
