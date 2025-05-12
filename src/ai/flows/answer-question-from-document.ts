// src/ai/flows/answer-question-from-document.ts
'use server';

/**
 * @fileOverview Answers questions based on the provided document text.
 *
 * - answerQuestionFromDocument - A function that handles the question answering process.
 * - AnswerQuestionFromDocumentInput - The input type for the answerQuestionFromDocument function.
 * - AnswerQuestionFromDocumentOutput - The return type for the answerQuestionFromDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionFromDocumentInputSchema = z.object({
  documentText: z
    .string()
    .describe('The text content of the document to search for an answer.'),
  question: z.string().describe('The question asked by the user.'),
});
export type AnswerQuestionFromDocumentInput = z.infer<typeof AnswerQuestionFromDocumentInputSchema>;

const AnswerQuestionFromDocumentOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, derived solely from the document text, or a statement if the answer cannot be found.'),
});
export type AnswerQuestionFromDocumentOutput = z.infer<typeof AnswerQuestionFromDocumentOutputSchema>;

export async function answerQuestionFromDocument(input: AnswerQuestionFromDocumentInput): Promise<AnswerQuestionFromDocumentOutput> {
  return answerQuestionFromDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionFromDocumentPrompt',
  input: {schema: AnswerQuestionFromDocumentInputSchema},
  output: {schema: AnswerQuestionFromDocumentOutputSchema},
  prompt: `You are a helpful assistant. Your task is to answer the question below based *only* on the provided "Document Text".

Follow these instructions strictly:
1.  Read the "Document Text" carefully.
2.  Analyze the "Question".
3.  If the answer to the "Question" can be found directly within the "Document Text", provide a concise and accurate answer based *only* on that text.
4.  If the "Document Text" does not contain the information to answer the "Question", you MUST respond with the exact phrase: "I'm sorry, but I cannot answer this question based on the provided document."
5.  Do NOT use any external knowledge or information not present in the "Document Text".
6.  Do NOT attempt to infer or guess answers if the information is not explicitly available.

Document Text:
{{{documentText}}}

Question:
{{{question}}}

Answer:
`,
  // Consider safety settings if dealing with potentially sensitive user-uploaded content
  // config: {
  //   safetySettings: [
  //     {
  //       category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
  //       threshold: 'BLOCK_ONLY_HIGH',
  //     },
  //   ],
  // },
});

const answerQuestionFromDocumentFlow = ai.defineFlow(
  {
    name: 'answerQuestionFromDocumentFlow',
    inputSchema: AnswerQuestionFromDocumentInputSchema,
    outputSchema: AnswerQuestionFromDocumentOutputSchema,
  },
  async input => {
    // Ensure documentText is not excessively long to avoid hitting model token limits.
    // This is a basic check; more sophisticated truncation/chunking might be needed for very large docs.
    const maxInputLength = 20000; // Example limit, adjust based on model and expected doc size
    if (input.documentText.length > maxInputLength) {
        input.documentText = input.documentText.substring(0, maxInputLength);
    }
    
    const {output} = await prompt(input);
    return output ?? { answer: "I encountered an issue processing your question. Please try again." };
  }
);
