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
import { Brain } from "lucide-react";

const formSchema = z.object({
  documentText: z.string().min(50, {
    message: "Document text must be at least 50 characters.",
  }).max(10000, {
    message: "Document text must not exceed 10,000 characters.",
  }),
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }).max(50, {
    message: "Topic must not exceed 50 characters.",
  }),
});

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
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          Generate Study Aids
        </CardTitle>
        <CardDescription>
          Paste your document content below and specify the main topic to generate flashcards and quizzes.
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
                      data-ai-hint="study material"
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
                    <Input placeholder="e.g., Photosynthesis, World War II" {...field}  data-ai-hint="subject matter"/>
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
