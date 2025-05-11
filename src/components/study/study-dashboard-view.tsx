"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Zap, BookOpen } from "lucide-react";

interface StudyDashboardViewProps {
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  hasFlashcards: boolean;
  hasQuiz: boolean;
  documentSummary: string | null;
  keyTopics: string[] | null;
}

export function StudyDashboardView({ 
  onStartFlashcards, 
  onStartQuiz,
  hasFlashcards,
  hasQuiz,
  documentSummary,
  keyTopics
}: StudyDashboardViewProps): JSX.Element {
  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Document Summary & Topics
          </CardTitle>
          {documentSummary ? (
            <CardDescription>
              Summary and key topics from your document.
            </CardDescription>
          ) : (
            <CardDescription>
              Provide document text or upload a PDF to see its summary and key topics here.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {documentSummary ? (
            <ScrollArea className="h-[200px] pr-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Summary:</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap text-sm">
                    {documentSummary}
                  </p>
                </div>
                {keyTopics && keyTopics.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Key Topics:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {keyTopics.map((topic, index) => (
                        <li key={index} className="text-foreground/90 text-sm">{topic}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">
              The summary and key topics will appear here after processing your input.
            </p>
          )}
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
            <p className="text-sm">Review key terms and concepts from your document.</p>
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
            <p className="text-sm">Challenge yourself and identify areas for improvement.</p>
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
