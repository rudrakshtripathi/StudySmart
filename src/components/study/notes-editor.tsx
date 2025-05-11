
// src/components/study/notes-editor.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotesEditorProps {
  onExit: () => void;
  initialNotes?: string; 
}

export function NotesEditor({ onExit, initialNotes = "" }: NotesEditorProps): JSX.Element {
  const [notes, setNotes] = useState(initialNotes);
  const { toast } = useToast();

  const handleDownload = () => {
    if (!notes.trim()) {
      toast({
        title: "Empty Notes",
        description: "There's nothing to download.",
        variant: "destructive",
      });
      return;
    }
    try {
      const blob = new Blob([notes], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "studysmart-notes.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Download Started",
        description: "Your notes are being downloaded.",
      });
    } catch (error) {
        console.error("Failed to download notes:", error);
        toast({
            title: "Download Failed",
            description: "Could not download your notes. Please try again.",
            variant: "destructive",
        });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl animate-pop-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit3 className="h-7 w-7 text-primary" />
            Make Your Own Notes
          </CardTitle>
          <Button variant="outline" onClick={onExit} size="sm" className="flex items-center gap-1 hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </div>
        <CardDescription>
          Jot down your thoughts, summaries, and key points. Download them as a .txt file when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Start typing your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={18} 
          className="w-full text-base p-4 border-2 border-input focus:border-primary transition-colors shadow-inner resize-y min-h-[300px]"
          data-ai-hint="notes textarea"
        />
      </CardContent>
      <CardFooter className="flex justify-end pt-6">
        <Button onClick={handleDownload} disabled={!notes.trim()} className="gap-2 text-lg py-6 px-8 transition-transform hover:scale-105 active:scale-95">
          <Download className="h-5 w-5" />
          Download Notes
        </Button>
      </CardFooter>
    </Card>
  );
}
