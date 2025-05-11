// src/ai/flows/generate-flashcards.ts
'use server';

/**
 * @fileOverview Generates flashcards from a document.
 *
 * - generateFlashcards - A function that handles the flashcard generation process.
 * - GenerateFlashcardsInput - The input type for the generateFlashcards function.
 * - GenerateFlashcardsOutput - The return type for the generateFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFlashcardsInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to generate flashcards from.'),
  topic: z.string().describe('The main topic of the document.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('The front side of the flashcard.'),
        back: z.string().describe('The back side of the flashcard.'),
      })
    )
    .describe('An array of flashcards generated from the document content.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert in creating flashcards for learning and memorization. Given the document text and the main topic, generate a set of flashcards that cover the key concepts.

Topic: {{{topic}}}

Document Text:
{{{documentText}}}

Flashcards should be in a question/answer format to facilitate active recall. Each flashcard should have a clear and concise question on the front and a detailed answer on the back.

Ensure that the flashcards are relevant to the topic and cover the most important information from the document.

Output the flashcards as a JSON array of objects, where each object has a 'front' (question) and 'back' (answer) field.
`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
