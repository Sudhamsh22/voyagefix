'use server';
/**
 * @fileOverview An AI chat assistant for travel planning.
 *
 * - chatWithTripAssistant - A function that handles conversational interactions with the AI travel assistant.
 * - AIChatTripAssistantInput - The input type for the chatWithTripAssistant function.
 * - AIChatTripAssistantOutput - The return type for the chatWithTripAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatTripAssistantInputSchema = z.object({
  userMessage: z.string().describe('The message from the user to the AI assistant.'),
  currentItinerary: z.string().optional().describe('The current trip itinerary or context in a natural language format. This should include destination, dates, and planned activities.'),
});
export type AIChatTripAssistantInput = z.infer<typeof AIChatTripAssistantInputSchema>;

const AIChatTripAssistantOutputSchema = z.object({
  assistantResponse: z.string().describe('The conversational response from the AI assistant.'),
});
export type AIChatTripAssistantOutput = z.infer<typeof AIChatTripAssistantOutputSchema>;

export async function chatWithTripAssistant(input: AIChatTripAssistantInput): Promise<AIChatTripAssistantOutput> {
  return aiChatTripAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatTripAssistantPrompt',
  input: {schema: AIChatTripAssistantInputSchema},
  output: {schema: AIChatTripAssistantOutputSchema},
  prompt: `You are an AI-powered travel assistant named VoyageFlix, designed to help users with their travel plans.
Your goal is to answer questions about trips, suggest activities, and help modify existing itineraries in a conversational and helpful way.

Current Trip Itinerary (if available):
{{#if currentItinerary}}
{{{currentItinerary}}}
{{else}}
No specific itinerary provided yet.
{{/if}}

User's message: {{{userMessage}}}

Based on the user's message and the current itinerary (if provided), please provide a helpful and conversational response.
If the user asks to modify the itinerary, suggest how it could be modified. Do not actually modify the itinerary yourself, just provide suggestions.
`,
});

const aiChatTripAssistantFlow = ai.defineFlow(
  {
    name: 'aiChatTripAssistantFlow',
    inputSchema: AIChatTripAssistantInputSchema,
    outputSchema: AIChatTripAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
