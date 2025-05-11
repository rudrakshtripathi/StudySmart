
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Zap, BookOpen } from "lucide-react";
import type { SummarizeDocumentOutput } from "@/ai/flows/summarize-document";

interface StudyDashboardViewProps {
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  hasFlashcards: boolean;
  hasQuiz: boolean;
  topicSummaries: SummarizeDocumentOutput['topicSummaries'] | null;
}

export function StudyDashboardView({ 
  onStartFlashcards, 
  onStartQuiz,
  hasFlashcards,
  hasQuiz,
  topicSummaries
}: StudyDashboardViewProps): JSX.Element {
  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto animate-fade-in-slide-up">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pop-in delay-100">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Document Topic Summaries
          </CardTitle>
          {topicSummaries && topicSummaries.length > 0 ? (
            <CardDescription>
              Key topics and their bullet-point summaries from your document.
            </CardDescription>
          ) : (
            <CardDescription>
              Upload a PDF document to see its topic summaries here.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {topicSummaries && topicSummaries.length > 0 ? (
            <ScrollArea className="h-[250px] pr-4">
              <div className="space-y-6">
                {topicSummaries.map((item, index) => (
                  <div key={index} className="animate-fade-in-slide-up" style={{animationDelay: `${index * 100}ms`}}>
                    <h3 className="font-semibold text-lg mb-2 text-primary">{item.topic}</h3>
                    {item.bulletPoints && item.bulletPoints.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 pl-4">
                        {item.bulletPoints.map((point, pIndex) => (
                          <li key={pIndex} className="text-foreground/90 text-sm animate-fade-in" style={{animationDelay: `${(index * 100) + (pIndex * 50)}ms`}}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm italic pl-4">No specific bullet points provided for this topic.</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-muted-foreground">
              Topic-wise summaries will appear here after processing your PDF.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pop-in delay-200">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              Flashcards
            </CardTitle>
            <CardDescription>Reinforce your learning with interactive flashcards.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Review key terms and concepts based on the document summaries.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onStartFlashcards} className="w-full transition-transform hover:scale-105 active:scale-95" disabled={!hasFlashcards}>
              {hasFlashcards ? "Study Flashcards" : "No Flashcards Generated"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pop-in delay-300">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              MCQ Quiz
            </CardTitle>
            <CardDescription>Test your understanding with a multiple-choice quiz.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Challenge yourself based on the document summaries.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={onStartQuiz} className="w-full transition-transform hover:scale-105 active:scale-95" disabled={!hasQuiz}>
               {hasQuiz ? "Take Quiz" : "No Quiz Generated"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
