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
  topic: z.string().describe('The main topic of the document, used as context for flashcard generation.'),
});
export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;

const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z
    .array(
      z.object({
        front: z.string().describe('A concise question targeting a single, specific piece of information (e.g., a definition, a key fact).'),
        back: z.string().describe('A brief, direct, one-liner answer to the question on the front.'),
      })
    )
    .describe('An array of flashcards generated from the document content. Each flashcard should focus on rapid recall of specific facts.'),
});
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: {schema: GenerateFlashcardsInputSchema},
  output: {schema: GenerateFlashcardsOutputSchema},
  prompt: `You are an expert in creating highly effective flashcards for rapid learning and memorization.
Your task is to generate a set of flashcards based on the provided document text and topic.

Topic: {{{topic}}}

Document Text:
{{{documentText}}}

Guidelines for Flashcard Generation:
1.  **Accuracy is paramount.** Ensure all information is correct and directly derived from the document text.
2.  **Front of Card (Question):**
    *   Must be a concise and clear question targeting a single, specific piece of information (e.g., a definition, a key fact, a simple concept).
    *   Avoid overly broad or multi-part questions. The question should ideally lead to a one-liner answer.
3.  **Back of Card (Answer):**
    *   Must be a **one-liner answer**. It should be very brief, direct, and to the point.
    *   The answer should directly and fully address the question on the front.
4.  **Relevance:** All flashcards must be highly relevant to the given topic and derived strictly from the provided document text.
5.  **Focus:** The goal is rapid recall of specific facts, definitions, or key concepts.

Output the flashcards as a JSON array of objects, where each object has a 'front' (question) and 'back' (answer) field.
Example of a good flashcard format:
{
  "front": "What is the primary function of mitochondria?",
  "back": "To generate most of the cell's supply of ATP."
}
Another example:
{
  "front": "Define 'photosynthesis'.",
  "back": "The process by which green plants use sunlight, water, and carbon dioxide to create their own food."
}
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
    // Ensure output is not null and flashcards array exists, even if empty
    return output ?? { flashcards: [] };
  }
);
