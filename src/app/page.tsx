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
import { summarizeDocument, type SummarizeDocumentOutput } from "@/ai/flows/summarize-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Star } from "lucide-react";


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
  const [documentSummary, setDocumentSummary] = useState<string | null>(null);
  const [keyTopics, setKeyTopics] = useState<string[] | null>(null);


  const { toast } = useToast();

  const handleFormSubmit = async (values: DocumentInputFormValues) => {
    setCurrentStep("loading");
    // Reset previous data
    setFlashcardsData(null);
    setQuizData(null);
    setDocumentSummary(null);
    setKeyTopics(null);
    
    let textForProcessing: string = "";
    let topicForProcessing: string = values.topic;

    try {
      if (values.documentFile) {
        const dataUri = await fileToDataUri(values.documentFile);
        toast({ title: "Processing PDF...", description: "Extracting text and summarizing." });
        const summaryResult = await summarizeDocument({ documentDataUri: dataUri });
        textForProcessing = summaryResult.summary;
        setDocumentSummary(summaryResult.summary);
        if (summaryResult.keyTopics && summaryResult.keyTopics.length > 0) {
          topicForProcessing = values.topic || summaryResult.keyTopics[0]; // Prioritize user topic
          setKeyTopics(summaryResult.keyTopics);
        } else {
          setKeyTopics([values.topic]); // Fallback to user-provided topic if AI doesn't return any
        }
        toast({ title: "PDF Processed", description: "Summary and key topics extracted." });
      } else if (values.documentText) {
        textForProcessing = values.documentText;
        // For plain text input, we can show a snippet as "summary" and use the provided topic.
        setDocumentSummary(textForProcessing.length > 300 ? textForProcessing.substring(0, 297) + "..." : textForProcessing);
        setKeyTopics([values.topic]);
      } else {
        // This case should be prevented by form validation
        toast({ title: "Error", description: "No document content provided.", variant: "destructive" });
        setCurrentStep("input");
        return;
      }

      if (!textForProcessing) {
          toast({ title: "Error", description: "Could not extract text for processing. The document might be empty or unreadable.", variant: "destructive" });
          setCurrentStep("input");
          return;
      }
      
      toast({ title: "Generating Study Aids...", description: "Please wait a moment." });
      const [flashcardsResult, quizResult] = await Promise.all([
        generateFlashcards({ documentText: textForProcessing, topic: topicForProcessing }),
        generateMcqQuiz({ text: textForProcessing, numQuestions: 5 })
      ]);

      if (flashcardsResult.flashcards && flashcardsResult.flashcards.length > 0) {
        setFlashcardsData(flashcardsResult.flashcards);
      } else {
        setFlashcardsData(null);
        // Do not toast here if summary was successful, as user might only want summary
        if (!values.documentFile) toast({ title: "Info", description: "No flashcards were generated for the provided text." });
      }
      
      if (quizResult.quiz && quizResult.quiz.length > 0) {
        setQuizData(quizResult.quiz);
      } else {
        setQuizData(null);
         if (!values.documentFile) toast({ title: "Info", description: "No quiz questions were generated for the provided text." });
      }
      
      setCurrentStep("dashboard");
      toast({ title: "Success!", description: "Study aids generated successfully.", className: "bg-accent text-accent-foreground" });

    } catch (error) {
      console.error("Error generating study aids:", error);
      toast({
        title: "Error",
        description: `Failed to generate study aids. ${error instanceof Error ? error.message : 'Please try again.'}`,
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
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "input":
        return <DocumentInputForm onSubmit={handleFormSubmit} isLoading={false} />; // isLoading is implicitly managed by currentStep
      case "loading":
        return <LoadingSpinner size="lg" />;
      case "dashboard":
        return (
          <StudyDashboardView
            onStartFlashcards={() => setCurrentStep("flashcards")}
            onStartQuiz={() => setCurrentStep("quiz")}
            hasFlashcards={!!flashcardsData && flashcardsData.length > 0}
            hasQuiz={!!quizData && quizData.length > 0}
            documentSummary={documentSummary}
            keyTopics={keyTopics}
          />
        );
      case "flashcards":
        if (!flashcardsData) {
          toast({ title: "Error", description: "Flashcard data not found. Returning to dashboard.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <FlashcardPlayer flashcards={flashcardsData} onComplete={handleFlashcardComplete} onExit={() => setCurrentStep("dashboard")} />;
      case "quiz":
         if (!quizData) {
          toast({ title: "Error", description: "Quiz data not found. Returning to dashboard.", variant: "destructive" });
          setCurrentStep("dashboard");
          return <LoadingSpinner />;
        }
        return <QuizPlayer quiz={quizData} onComplete={handleQuizComplete} onExit={() => setCurrentStep("dashboard")} />;
      case "results":
        if (!studyResults) {
          setCurrentStep("dashboard"); 
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
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
        {renderStepContent()}
      </main>
      <footer className="py-4 text-center text-muted-foreground text-sm">
        StudySmart &copy; {new Date().getFullYear()} - Your AI Learning Companion
      </footer>
    </div>
  );
}
