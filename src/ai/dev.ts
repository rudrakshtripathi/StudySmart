import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mcq-quiz.ts';
import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/answer-question-from-document.ts';
