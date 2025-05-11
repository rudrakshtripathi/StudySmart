// This file is machine-generated - edit with caution!

'use server';

/**
 * @fileOverview Summarizes uploaded documents into topic-wise bullet points using an AI summarization tool.
 *
 * - summarizeDocument - A function that handles the document summarization process.
 * - SummarizeDocumentInput - The input type for the summarizeDocument function.
 * - SummarizeDocumentOutput - The return type for the summarizeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeDocumentInput = z.infer<typeof SummarizeDocumentInputSchema>;

const SummarizeDocumentOutputSchema = z.object({
  topicSummaries: z.array(z.object({
    topic: z.string().describe('A key topic identified in the document.'),
    bulletPoints: z.array(z.string()).describe('A list of 2-5 bullet points summarizing this topic.')
  })).describe('An array of topic-wise summaries, each with bullet points. Each topic should have at least 2-3 bullet points.')
});
export type SummarizeDocumentOutput = z.infer<typeof SummarizeDocumentOutputSchema>;

export async function summarizeDocument(input: SummarizeDocumentInput): Promise<SummarizeDocumentOutput> {
  return summarizeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDocumentPrompt',
  input: {schema: SummarizeDocumentInputSchema},
  output: {schema: SummarizeDocumentOutputSchema},
  prompt: `You are an expert summarizer. Analyze the following document.
Identify the key topics discussed in the document.
For each key topic, provide a concise summary in the form of 2-5 bullet points.
Ensure the bullet points capture the main ideas of each topic.

Document: {{media url=documentDataUri}}

Output the result as a JSON object matching the provided schema. If the document is too short or lacks distinct topics, return an empty array for topicSummaries.
`,
});

const summarizeDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeDocumentFlow',
    inputSchema: SummarizeDocumentInputSchema,
    outputSchema: SummarizeDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

