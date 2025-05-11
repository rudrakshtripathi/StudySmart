"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { DocumentInputForm, type DocumentInputFormValues } from "@/components/study/document-input-form";
import { StudyDashboardView } from "@/components/study/study-dashboard-view";
import { FlashcardPlayer } from "@/components/study/flashcard-player";
import { QuizPlayer } from "@/components/study/quiz-player";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards, type GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";
import { generateMcqQuiz, type GenerateMcqQuizOutput } from "@/ai/flows/generate-mcq-quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Star } from "lucide-react";


type AppStep = "input" | "loading" | "dashboard" | "flashcards" | "quiz" | "results";

interface StudyResults {
  type: 'flashcards' | 'quiz';
  pointsEarned: number;
  correctAnswers: number;
  totalAnswers: number;
}

export default function StudySmartPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<AppStep>("input");
  const [points, setPoints] = useState(0);
  
  const [flashcardsData, setFlashcardsData] = useState<GenerateFlashcardsOutput['flashcards'] | null>(null);
  const [quizData, setQuizData] = useState<GenerateMcqQuizOutput['quiz'] | null>(null);
  const [studyResults, setStudyResults] = useState<StudyResults | null>(null);

  const { toast } = useToast();

  const handleFormSubmit = async (values: DocumentInputFormValues) => {
    setCurrentStep("loading");
    try {
      const [flashcardsResult, quizResult] = await Promise.all([
        generateFlashcards({ documentText: values.documentText, topic: values.topic }),
        generateMcqQuiz({ text: values.documentText, numQuestions: 5 })
      ]);

      if (flashcardsResult.flashcards && flashcardsResult.flashcards.length > 0) {
        setFlashcardsData(flashcardsResult.flashcards);
      } else {
        setFlashcardsData(null);
        toast({ title: "Info", description: "No flashcards were generated for the provided text." });
      }
      
      if (quizResult.quiz && quizResult.quiz.length > 0) {
        setQuizData(quizResult.quiz);
      } else {
        setQuizData(null);
        toast({ title: "Info", description: "No quiz questions were generated for the provided text." });
      }
      
      setCurrentStep("dashboard");
      toast({ title: "Success!", description: "Study aids generated successfully.", className: "bg-green-500 text-white" });

    } catch (error) {
      console.error("Error generating study aids:", error);
      toast({
        title: "Error",
        description: "Failed to generate study aids. Please try again.",
        variant: "destructive",
      });
      setCurrentStep("input");
    }
  };

  const handleFlashcardComplete = (pointsEarnedSession: number, correctAnswers: number, totalAnswers: number) => {
    setPoints(prev => prev + pointsEarnedSession);
    setStudyResults({ type: 'flashcards', pointsEarned: pointsEarnedSession, correctAnswers, totalAnswers });
    setCurrentStep("results");
  };

  const handleQuizComplete = (pointsEarnedSession: number, correctAnswers: number, totalAnswers: number) => {
    setPoints(prev => prev + pointsEarnedSession);
    setStudyResults({ type: 'quiz', pointsEarned: pointsEarnedSession, correctAnswers, totalAnswers });
    setCurrentStep("results");
    setCurrentStep("results");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "input":
        return <DocumentInputForm onSubmit={handleFormSubmit} isLoading={false} />;
      case "loading":
        return <LoadingSpinner size="lg" />;
      case "dashboard":
        return (
          <StudyDashboardView
            onStartFlashcards={() => setCurrentStep("flashcards")}
            onStartQuiz={() => setCurrentStep("quiz")}
            hasFlashcards={!!flashcardsData && flashcardsData.length > 0}
            hasQuiz={!!quizData && quizData.length > 0}
          />
        );
      case "flashcards":
        if (!flashcardsData) {
          // Fallback if somehow flashcardsData is null
          toast({ title: "Error", description: "Flashcard data not found.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <FlashcardPlayer flashcards={flashcardsData} onComplete={handleFlashcardComplete} onExit={() => setCurrentStep("dashboard")} />;
      case "quiz":
         if (!quizData) {
          // Fallback
          toast({ title: "Error", description: "Quiz data not found.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <QuizPlayer quiz={quizData} onComplete={handleQuizComplete} onExit={() => setCurrentStep("dashboard")} />;
      case "results":
        if (!studyResults) {
          setCurrentStep("dashboard"); // Should not happen
          return null;
        }
        return (
          <Card className="w-full max-w-md mx-auto text-center shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <PartyPopper className="h-10 w-10 text-accent" />
                Session Complete!
              </CardTitle>
              <CardDescription className="text-lg">
                You completed the {studyResults.type === 'flashcards' ? 'Flashcard' : 'Quiz'} session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl">
                You scored <strong className="text-accent">{studyResults.correctAnswers}</strong> out of <strong className="text-primary">{studyResults.totalAnswers}</strong>.
              </div>
              <div className="text-xl">
                Points earned this session: <strong className="text-accent">{studyResults.pointsEarned}</strong>
              </div>
              <div className="text-2xl font-semibold flex items-center justify-center gap-2">
                <Star className="h-7 w-7 text-yellow-400 fill-yellow-400" />
                Total Points: <strong className="text-primary">{points}</strong>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setCurrentStep("dashboard")} size="lg">
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader points={points} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderStepContent()}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        StudySmart &copy; {new Date().getFullYear()} - Your AI Learning Companion
      </footer>
    </div>
  );
}
