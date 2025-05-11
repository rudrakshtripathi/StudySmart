"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileUp } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
  documentText: z.string().min(50, {
    message: "Document text must be at least 50 characters.",
  }).max(10000, {
    message: "Document text must not exceed 10,000 characters.",
  }).optional(),
  documentFile: z
    .instanceof(File)
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => !file || ACCEPTED_FILE_TYPES.includes(file.type), "Only PDF files are allowed."),
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }).max(50, {
    message: "Topic must not exceed 50 characters.",
  }),
}).refine(
  (data) => data.documentText || data.documentFile, {
    message: "Either paste text or upload a PDF file.",
    path: ["documentText"], 
  }
);

export type DocumentInputFormValues = z.infer<typeof formSchema>;

interface DocumentInputFormProps {
  onSubmit: (values: DocumentInputFormValues) => void;
  isLoading: boolean;
}

export function DocumentInputForm({ onSubmit, isLoading }: DocumentInputFormProps): JSX.Element {
  const form = useForm<DocumentInputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentText: "",
      topic: "",
      documentFile: undefined,
    },
  });

  const watchDocumentText = form.watch("documentText");
  const watchDocumentFile = form.watch("documentFile");

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          Generate Study Aids
        </CardTitle>
        <CardDescription>
          Paste your document content, or upload a PDF file, and specify the main topic to generate flashcards and quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="documentText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Document Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your document text here..."
                      className="min-h-[200px] resize-y text-base"
                      {...field}
                      disabled={!!watchDocumentFile} // Disable if file is selected
                      data-ai-hint="study material"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-muted"></div>
              <span className="mx-4 text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-muted"></div>
            </div>
            
            <FormField
              control={form.control}
              name="documentFile"
              render={({ field: { onChange, value, ...restField } }) => ( // Destructure to handle file input correctly
                <FormItem>
                  <FormLabel className="text-lg flex items-center gap-2"> <FileUp className="h-5 w-5"/> Upload PDF</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                      disabled={!!watchDocumentText && watchDocumentText.length > 0} // Disable if text is entered
                      className="file:text-primary file:font-semibold hover:file:bg-primary/10"
                      {...restField}
                      data-ai-hint="pdf document"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Main Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Photosynthesis, World War II" {...field} data-ai-hint="subject matter"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Study Aids"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
