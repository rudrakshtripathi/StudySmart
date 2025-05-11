// src/ai/flows/generate-mcq-quiz.ts
'use server';

/**
 * @fileOverview Generates a multiple-choice quiz from a given text.
 *
 * - generateMcqQuiz - A function that generates the quiz.
 * - GenerateMcqQuizInput - The input type for the generateMcqQuiz function.
 * - GenerateMcqQuizOutput - The return type for the generateMcqQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMcqQuizInputSchema = z.object({
  text: z.string().describe('The text to generate the quiz from.'),
  numQuestions: z.number().int().min(1).max(10).default(5).describe('The number of questions to generate.'),
});
export type GenerateMcqQuizInput = z.infer<typeof GenerateMcqQuizInputSchema>;

const GenerateMcqQuizOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The question.'),
      options: z.array(z.string()).describe('The options for the question.'),
      answer: z.string().describe('The correct answer.'),
    })
  ).describe('The generated quiz.'),
});
export type GenerateMcqQuizOutput = z.infer<typeof GenerateMcqQuizOutputSchema>;

export async function generateMcqQuiz(input: GenerateMcqQuizInput): Promise<GenerateMcqQuizOutput> {
  return generateMcqQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMcqQuizPrompt',
  input: {schema: GenerateMcqQuizInputSchema},
  output: {schema: GenerateMcqQuizOutputSchema},
  prompt: `You are an expert quiz generator. You will generate a multiple-choice quiz from the given text. The quiz should have {{numQuestions}} questions. Each question should have 4 options, one of which is the correct answer.

Text: {{{text}}}

Quiz:
`,
});

const generateMcqQuizFlow = ai.defineFlow(
  {
    name: 'generateMcqQuizFlow',
    inputSchema: GenerateMcqQuizInputSchema,
    outputSchema: GenerateMcqQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

