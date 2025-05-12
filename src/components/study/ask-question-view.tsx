// src/components/study/ask-question-view.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquareQuote, Send } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { answerQuestionFromDocument, type AnswerQuestionFromDocumentOutput } from "@/ai/flows/answer-question-from-document";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AskQuestionViewProps {
  documentText: string | null;
  onExit: () => void;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
}

export function AskQuestionView({ documentText, onExit }: AskQuestionViewProps): JSX.Element {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({ title: "Empty Question", description: "Please enter a question.", variant: "destructive" });
      return;
    }
    if (!documentText) {
        toast({ title: "Document Error", description: "Document text is not available to answer questions.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    const userMessage: ChatMessage = { id: `user-${Date.now()}`, type: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const result: AnswerQuestionFromDocumentOutput = await answerQuestionFromDocument({
        documentText: documentText,
        question: question,
      });
      const aiMessage: ChatMessage = { id: `ai-${Date.now()}`, type: 'ai', text: result.answer };
      setChatHistory(prev => [...prev, aiMessage]);
      setQuestion(""); // Clear input after sending
    } catch (error) {
      console.error("Error answering question:", error);
      const errorMessage: ChatMessage = { id: `error-${Date.now()}`, type: 'ai', text: "Sorry, I encountered an error trying to answer your question. Please try again." };
      setChatHistory(prev => [...prev, errorMessage]);
      toast({
        title: "Error",
        description: `Failed to get an answer. ${error instanceof Error ? error.message : 'Please try again.'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl animate-pop-in flex flex-col h-[calc(100vh-12rem)]"> {/* Adjusted height */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquareQuote className="h-7 w-7 text-primary" />
            Ask a Question
          </CardTitle>
          <Button variant="outline" onClick={onExit} size="sm" className="flex items-center gap-1 hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        <CardDescription>
          Ask questions based on the content of your uploaded document. The AI will answer using only the document's information.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <ScrollArea className="flex-grow pr-4 mb-4 h-0 min-h-[200px]"> {/* Scrollable chat history */}
            <div className="space-y-4">
                {chatHistory.map((chat) => (
                    <div key={chat.id} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 rounded-lg shadow ${
                            chat.type === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                        }`}>
                            <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && chatHistory.length > 0 && chatHistory[chatHistory.length -1].type === 'user' && (
                     <div className="flex justify-start">
                        <div className="max-w-[75%] p-3 rounded-lg shadow bg-muted text-muted-foreground">
                            <LoadingSpinner size="sm" />
                        </div>
                    </div>
                )}
            </div>
        </ScrollArea>
        <div className="mt-auto flex gap-2 items-center"> {/* Input area */}
          <Textarea
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            className="flex-grow resize-none"
            disabled={isLoading}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isLoading) handleAskQuestion();
                }
            }}
            data-ai-hint="user question"
          />
          <Button onClick={handleAskQuestion} disabled={isLoading || !question.trim()} className="h-full px-6 py-3 self-stretch">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send Question</span>
          </Button>
        </div>
      </CardContent>
       <CardFooter className="pt-4">
         <p className="text-xs text-muted-foreground">
            {documentText ? "AI will use the summarized document content to answer." : "Document content not loaded."}
         </p>
      </CardFooter>
    </Card>
  );
}
