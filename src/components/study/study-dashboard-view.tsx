
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Zap, BookOpen, NotebookPen, Download } from "lucide-react";
import type { SummarizeDocumentOutput } from "@/ai/flows/summarize-document";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface StudyDashboardViewProps {
  onStartFlashcards: () => void;
  onStartQuiz: () => void;
  onStartNotes: () => void; 
  hasFlashcards: boolean;
  hasQuiz: boolean;
  topicSummaries: SummarizeDocumentOutput['topicSummaries'] | null;
}

export function StudyDashboardView({ 
  onStartFlashcards, 
  onStartQuiz,
  onStartNotes,
  hasFlashcards,
  hasQuiz,
  topicSummaries
}: StudyDashboardViewProps): JSX.Element {
  const { toast } = useToast();

  const handleDownloadSummary = () => {
    if (!topicSummaries || topicSummaries.length === 0) {
      toast({ title: "No Summary", description: "No summary available to download.", variant: "destructive" });
      return;
    }

    try {
      const doc = new jsPDF();
      let yPos = 20; // Initial Y position (margin from top)
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      const lineHeight = 7; // Approximate line height for text
      const topicTitleSize = 16;
      const bulletPointSize = 12;

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Document Topic Summaries", pageWidth / 2, yPos, { align: 'center' });
      yPos += lineHeight * 2.5;

      topicSummaries.forEach((summaryItem) => {
        // Estimate height for the topic item
        let estimatedHeight = lineHeight * 1.5; // For topic title
        summaryItem.bulletPoints.forEach(point => {
          const splitPoint = doc.splitTextToSize(`• ${point}`, contentWidth -5); // -5 for bullet indent
          estimatedHeight += splitPoint.length * lineHeight;
        });
        estimatedHeight += lineHeight; // Space after bullets

        if (yPos + estimatedHeight > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }

        doc.setFontSize(topicTitleSize);
        doc.setFont('helvetica', 'bold');
        doc.text(summaryItem.topic, margin, yPos);
        yPos += lineHeight * 1.5; 

        doc.setFontSize(bulletPointSize);
        doc.setFont('helvetica', 'normal');
        summaryItem.bulletPoints.forEach(point => {
          const splitPoint = doc.splitTextToSize(`• ${point}`, contentWidth - 5);
          if (yPos + (splitPoint.length * lineHeight) > pageHeight - margin) {
            doc.addPage();
            yPos = margin;
            // Re-add topic title if it's a new page and this is the first bullet of a topic
            // This check is simplified, assuming topic title won't be alone at bottom of a page
          }
          doc.text(splitPoint, margin + 5, yPos);
          yPos += (splitPoint.length * lineHeight);
        });
        yPos += lineHeight; 
      });

      doc.save("document_summary.pdf");
      toast({ title: "Download Started", description: "Your summary PDF is being downloaded." });
    } catch (error) {
        console.error("Failed to generate summary PDF:", error);
        toast({
            title: "Download Failed",
            description: "Could not generate the summary PDF. Please try again.",
            variant: "destructive",
        });
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Document Topic Summaries Card - takes 2 columns on md and up */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-pop-in delay-100 md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
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
              </div>
              <Button 
                onClick={handleDownloadSummary} 
                className="ml-auto transition-transform hover:scale-105 active:scale-95" 
                variant="outline"
                size="sm"
                disabled={!topicSummaries || topicSummaries.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                {topicSummaries && topicSummaries.length > 0 ? "Download PDF" : "No Summary"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {topicSummaries && topicSummaries.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4"> {/* Adjusted height slightly */}
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
          {/* CardFooter can be removed if it's empty or add other elements if needed */}
           {/* <CardFooter>
             
           </CardFooter> */}
        </Card>

        {/* Study Aids Section - takes 1 column on md and up, stacks Flashcards, Quiz and Notes vertically */}
        <div className="md:col-span-1 space-y-8">
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
              <Button 
                onClick={onStartNotes} 
                className="w-full transition-transform hover:scale-105 active:scale-95"
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

