"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Zap, BookOpen } from "lucide-react";

interface StudyDashboardViewProps {
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  hasFlashcards: boolean;
  hasQuiz: boolean;
}

export function StudyDashboardView({ 
  onStartFlashcards, 
  onStartQuiz,
  hasFlashcards,
  hasQuiz
}: StudyDashboardViewProps): JSX.Element {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Document Summary & Topics
          </CardTitle>
          <CardDescription>
            AI-powered summarization helps you grasp key concepts quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Document summarization and key topic identification based on uploaded PDF files will be available in a future version. 
            For now, flashcards and quizzes are generated based on the text you provided.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Flashcards
            </CardTitle>
            <CardDescription>Reinforce your learning with interactive flashcards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review key terms and concepts from your document.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onStartFlashcards} className="w-full" disabled={!hasFlashcards}>
              {hasFlashcards ? "Study Flashcards" : "No Flashcards Generated"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              MCQ Quiz
            </CardTitle>
            <CardDescription>Test your understanding with a multiple-choice quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Challenge yourself and identify areas for improvement.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onStartQuiz} className="w-full" disabled={!hasQuiz}>
               {hasQuiz ? "Take Quiz" : "No Quiz Generated"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
