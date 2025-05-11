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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileUp } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf"];

const formSchema = z.object({
  documentFile: z
    .instanceof(File, { message: "Please upload a PDF file."})
    .refine(file => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(file => ACCEPTED_FILE_TYPES.includes(file.type), "Only PDF files are allowed (.pdf).")
    .describe("The PDF document to process."),
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
      documentFile: undefined,
    },
  });

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl animate-pop-in">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" />
          Generate Study Aids
        </CardTitle>
        <CardDescription>
          Upload your PDF document to generate topic-wise summaries, flashcards, and quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="documentFile"
              render={({ field: { onChange, value, ...restField } }) => ( 
                <FormItem>
                  <FormLabel className="text-lg flex items-center gap-2"> <FileUp className="h-5 w-5"/> Upload PDF Document</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => onChange(e.target.files?.[0] ?? undefined)}
                      className="file:text-primary file:font-semibold hover:file:bg-primary/10 transition-shadow focus:shadow-lg focus:ring-2 focus:ring-primary/50"
                      {...restField}
                      data-ai-hint="pdf document"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6 transition-transform hover:scale-105 active:scale-95" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Study Aids"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
