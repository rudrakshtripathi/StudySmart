
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Zap, BookOpen, NotebookPen } from "lucide-react";
import type { SummarizeDocumentOutput } from "@/ai/flows/summarize-document";

interface StudyDashboardViewProps {
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  // Add a new prop for handling "Make Notes" action, if it becomes interactive later
  // onStartNotes?: () => void; 
  hasFlashcards: boolean;
  hasQuiz: boolean;
  topicSummaries: SummarizeDocumentOutput['topicSummaries'] | null;
}

export function StudyDashboardView({ 
  onStartFlashcards, 
  onStartQuiz,
  // onStartNotes,
  hasFlashcards,
  hasQuiz,
  topicSummaries
}: StudyDashboardViewProps): JSX.Element {
  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-slide-up"> {/* Increased max-width */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Increased gap */}
        {/* Document Topic Summaries Card - takes 2 columns on md and up */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pop-in delay-100 md:col-span-2">
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
              <ScrollArea className="h-[550px] pr-4"> {/* Increased height */}
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

        {/* Study Aids Section - takes 1 column on md and up, stacks Flashcards, Quiz and Notes vertically */}
        <div className="md:col-span-1 space-y-8"> {/* Increased space-y for consistency with gap */}
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

          <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-pop-in delay-400">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <NotebookPen className="h-6 w-6 text-primary" />
                Make Your Own Notes
              </CardTitle>
              <CardDescription>Create personalized notes to consolidate your learning.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Jot down key points, questions, or ideas related to the document.</p>
            </CardContent>
            <CardFooter>
              {/* This button is a placeholder for now. Functionality to be added later. */}
              <Button 
                onClick={() => { /* Placeholder for onStartNotes if implemented */ alert("Feature coming soon!"); }} 
                className="w-full transition-transform hover:scale-105 active:scale-95"
                // disabled // Or enable if you want to show the alert
              >
                Start Noting
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

