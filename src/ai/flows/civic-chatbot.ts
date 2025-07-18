'use server';

/**
 * @fileOverview A civic chatbot AI agent that answers questions about safety ratings and local trends.
 *
 * - civicChatbot - A function that handles the chatbot interaction.
 * - CivicChatbotInput - The input type for the civicChatbot function.
 * - CivicChatbotOutput - The return type for the civicChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CivicChatbotInputSchema = z.object({
  query: z.string().describe('The question from the user about safety ratings or local trends.'),
});
export type CivicChatbotInput = z.infer<typeof CivicChatbotInputSchema>;

const CivicChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user query.'),
});
export type CivicChatbotOutput = z.infer<typeof CivicChatbotOutputSchema>;

export async function civicChatbot(input: CivicChatbotInput): Promise<CivicChatbotOutput> {
  return civicChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'civicChatbotPrompt',
  input: {schema: CivicChatbotInputSchema},
  output: {schema: CivicChatbotOutputSchema},
  prompt: `You are a civic chatbot that answers question about safety ratings and local trends.

  Answer the following question:

  {{query}}
  `,
});

const civicChatbotFlow = ai.defineFlow(
  {
    name: 'civicChatbotFlow',
    inputSchema: CivicChatbotInputSchema,
    outputSchema: CivicChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
