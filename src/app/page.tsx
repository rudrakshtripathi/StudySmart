
"use client";

import { useState, useEffect, useRef } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { DocumentInputForm, type DocumentInputFormValues } from "@/components/study/document-input-form";
import { StudyDashboardView } from "@/components/study/study-dashboard-view";
import { FlashcardPlayer } from "@/components/study/flashcard-player";
import { QuizPlayer } from "@/components/study/quiz-player";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { generateFlashcards, type GenerateFlashcardsOutput } from "@/ai/flows/generate-flashcards";
import { generateMcqQuiz, type GenerateMcqQuizOutput } from "@/ai/flows/generate-mcq-quiz";
import { summarizeDocument, type SummarizeDocumentOutput } from "@/ai/flows/summarize-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Star } from "lucide-react";
import { studyQuotes } from "@/lib/quotes";


type AppStep = "input" | "loading" | "dashboard" | "flashcards" | "quiz" | "results";

interface StudyResults {
  type: 'flashcards' | 'quiz';
  pointsEarned: number;
  correctAnswers: number;
  totalAnswers: number;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export default function StudySmartPage(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<AppStep>("input");
  const [points, setPoints] = useState(0);
  
  const [flashcardsData, setFlashcardsData] = useState<GenerateFlashcardsOutput['flashcards'] | null>(null);
  const [quizData, setQuizData] = useState<GenerateMcqQuizOutput['quiz'] | null>(null);
  const [studyResults, setStudyResults] = useState<StudyResults | null>(null);
  const [documentTopicSummaries, setDocumentTopicSummaries] = useState<SummarizeDocumentOutput['topicSummaries'] | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [motivationalQuote, setMotivationalQuote] = useState<string | null>(null);
  const quoteIntervalRef = useRef<NodeJS.Timeout | null>(null);


  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (currentStep === "loading") {
      // Set initial quote immediately
      setMotivationalQuote(studyQuotes[Math.floor(Math.random() * studyQuotes.length)]);
      
      // Start interval to change quote every 3 seconds
      quoteIntervalRef.current = setInterval(() => {
        setMotivationalQuote(studyQuotes[Math.floor(Math.random() * studyQuotes.length)]);
      }, 3000);
    } else {
      // Clear interval if currentStep is not "loading"
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
        quoteIntervalRef.current = null;
      }
      // Ensure quote is cleared if not loading (also handled in handleFormSubmit)
      if (motivationalQuote !== null) {
        setMotivationalQuote(null);
      }
    }

    // Cleanup function for when component unmounts or currentStep changes
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
        quoteIntervalRef.current = null;
      }
    };
  }, [currentStep, motivationalQuote]); // Dependency array includes currentStep and motivationalQuote

  const handleFormSubmit = async (values: DocumentInputFormValues) => {
    // Reset previous data
    setFlashcardsData(null);
    setQuizData(null);
    setDocumentTopicSummaries(null);
    // Motivational quote handling is now primarily in useEffect based on currentStep

    setCurrentStep("loading"); // This will trigger the useEffect to start displaying quotes
    
    if (!values.documentFile) {
        toast({ title: "Error", description: "Please upload a PDF document.", variant: "destructive" });
        setCurrentStep("input"); // This will trigger useEffect to clear quotes
        return;
    }

    try {
      const dataUri = await fileToDataUri(values.documentFile);
      
      toast({ title: "Processing PDF...", description: "Extracting text and generating topic summaries." });
      
      const summaryResult = await summarizeDocument({ documentDataUri: dataUri });

      if (summaryResult.topicSummaries && summaryResult.topicSummaries.length > 0) {
        setDocumentTopicSummaries(summaryResult.topicSummaries);

        const allBulletPoints = summaryResult.topicSummaries.flatMap(ts => ts.bulletPoints);
        const textForProcessing = allBulletPoints.join("\n"); 
        
        if (textForProcessing.length < 50) { 
             toast({ title: "Info", description: "The document content after summarization is very short. Generated study aids might be limited." });
        }

        const topicForFlashcards = summaryResult.topicSummaries[0]?.topic || "Document Overview";

        toast({ title: "PDF Processed", description: "Topic summaries extracted." });
        toast({ title: "Generating Study Aids...", description: "Please wait a moment." });

        const [flashcardsResult, quizResult] = await Promise.all([
          generateFlashcards({ documentText: textForProcessing, topic: topicForFlashcards }),
          generateMcqQuiz({ text: textForProcessing, numQuestions: 5 })
        ]);

        if (flashcardsResult.flashcards && flashcardsResult.flashcards.length > 0) {
          setFlashcardsData(flashcardsResult.flashcards);
        } else {
          setFlashcardsData(null);
          toast({ title: "Info", description: "No flashcards were generated based on the document summaries." });
        }
        
        if (quizResult.quiz && quizResult.quiz.length > 0) {
          setQuizData(quizResult.quiz);
        } else {
          setQuizData(null);
          toast({ title: "Info", description: "No quiz questions were generated based on the document summaries." });
        }
        
        setCurrentStep("dashboard"); // This will trigger useEffect to clear quotes
        toast({ title: "Success!", description: "Study aids generated successfully.", className: "bg-accent text-accent-foreground" });

      } else {
        setCurrentStep("input"); // This will trigger useEffect to clear quotes
        toast({ title: "Processing Issue", description: "Could not generate topic summaries from the document. It might be empty, unreadable, or lack clear topics. Please try a different document.", variant: "destructive" });
        return;
      }

    } catch (error) {
      console.error("Error generating study aids:", error);
      setCurrentStep("input"); // This will trigger useEffect to clear quotes
      toast({
        title: "Error",
        description: `Failed to generate study aids. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
        // Ensure quote is cleared if it hasn't been by a step change already
        if (quoteIntervalRef.current) {
            clearInterval(quoteIntervalRef.current);
            quoteIntervalRef.current = null;
        }
        setMotivationalQuote(null);
    }
  };

  const handleIncrementGlobalPoints = (amount: number) => {
    setPoints(prev => prev + amount);
  };

  const handleFlashcardComplete = (pointsEarnedSession: number, correctAnswers: number, totalAnswers: number) => {
    setStudyResults({ type: 'flashcards', pointsEarned: pointsEarnedSession, correctAnswers, totalAnswers });
    setCurrentStep("results");
  };

  const handleQuizComplete = (pointsEarnedSession: number, correctAnswers: number, totalAnswers: number) => {
    setStudyResults({ type: 'quiz', pointsEarned: pointsEarnedSession, correctAnswers, totalAnswers });
    setCurrentStep("results");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "input":
        return <DocumentInputForm onSubmit={handleFormSubmit} isLoading={currentStep === "loading"} />;
      case "loading":
        return (
          <div className="animate-pop-in text-center">
            <LoadingSpinner size="lg" />
            {motivationalQuote && (
              <p className="mt-6 text-lg text-muted-foreground italic animate-fade-in-slide-up delay-500 min-h-[50px] flex items-center justify-center">
                &ldquo;{motivationalQuote}&rdquo;
              </p>
            )}
             {!motivationalQuote && <div className="mt-6 min-h-[50px]"></div>} {/* Placeholder for consistent layout */}
          </div>
        );
      case "dashboard":
        return (
          <StudyDashboardView
            onStartFlashcards={() => setCurrentStep("flashcards")}
            onStartQuiz={() => setCurrentStep("quiz")}
            hasFlashcards={!!flashcardsData && flashcardsData.length > 0}
            hasQuiz={!!quizData && quizData.length > 0}
            topicSummaries={documentTopicSummaries}
          />
        );
      case "flashcards":
        if (!flashcardsData) {
          toast({ title: "Error", description: "Flashcard data not found. Returning to dashboard.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <FlashcardPlayer 
                  flashcards={flashcardsData} 
                  onComplete={handleFlashcardComplete} 
                  onExit={() => setCurrentStep("dashboard")} 
                  onIncrementPoints={handleIncrementGlobalPoints}
                />;
      case "quiz":
         if (!quizData) {
          toast({ title: "Error", description: "Quiz data not found. Returning to dashboard.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <QuizPlayer 
                  quiz={quizData} 
                  onComplete={handleQuizComplete} 
                  onExit={() => setCurrentStep("dashboard")} 
                  onIncrementPoints={handleIncrementGlobalPoints}
                />;
      case "results":
        if (!studyResults) {
          setCurrentStep("dashboard"); 
          return null;
        }
        return (
          <Card className="w-full max-w-md mx-auto text-center shadow-xl animate-pop-in">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <PartyPopper className="h-10 w-10 text-accent animate-pulse-glow" />
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
                <Star className="h-7 w-7 text-yellow-400 fill-yellow-400 animate-pulse-glow delay-500" />
                Total Points: <strong className="text-primary">{points}</strong>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => setCurrentStep("dashboard")} size="lg" className="animate-pulse-glow delay-1000">
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
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        <div key={currentStep} className="w-full animate-in fade-in-0 slide-in-from-bottom-8 duration-500 ease-out">
          {renderStepContent()}
        </div>
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm animate-fade-in-slide-up">
        {currentYear !== null ? `StudySmart © ${currentYear} - Your AI Learning Companion` : 'Loading year...'}
      </footer>
    </div>
  );
}

  
