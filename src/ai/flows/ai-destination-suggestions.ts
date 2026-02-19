'use server';
/**
 * @fileOverview An AI agent for generating personalized travel destination suggestions.
 *
 * - suggestDestinations - A function that handles the destination suggestion process.
 * - SuggestDestinationsInput - The input type for the suggestDestinations function.
 * - SuggestDestinationsOutput - The return type for the suggestDestinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDestinationsInputSchema = z.object({
  preferences: z
    .array(z.string())
    .describe(
      'A list of user travel preferences (e.g., beach, adventure, culture, relaxation, luxury).' 
    ),
  budget: z.string().describe('The user\'s budget for the trip (e.g., low, medium, high, luxury).'),
  season: z.string().describe('The desired travel season (e.g., Summer, Winter, Spring, Fall, year-round).'),
});
export type SuggestDestinationsInput = z.infer<typeof SuggestDestinationsInputSchema>;

const SuggestDestinationsOutputSchema = z.object({
  destinations: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested destination.'),
        description: z.string().describe('A brief description of the destination.'),
        reason: z.string().describe('Why this destination is a good fit based on the user\'s input.'),
        activities: z
          .array(z.string())
          .describe('A list of suggested activities or highlights in this destination.'),
        bestTimeToVisit: z.string().describe('The best time of year to visit this destination.'),
        estimatedCost: z.string().describe('An estimated cost indicator for this destination (e.g., low, moderate, high).'),
      })
    )
    .describe('A list of personalized destination suggestions.'),
});
export type SuggestDestinationsOutput = z.infer<typeof SuggestDestinationsOutputSchema>;

export async function suggestDestinations(input: SuggestDestinationsInput): Promise<SuggestDestinationsOutput> {
  return aiDestinationSuggestionsFlow(input);
}

const destinationSuggestionsPrompt = ai.definePrompt({
  name: 'destinationSuggestionsPrompt',
  input: {schema: SuggestDestinationsInputSchema},
  output: {schema: SuggestDestinationsOutputSchema},
  prompt: `You are an expert travel agent. Based on the user's preferences, budget, and desired travel season, suggest 3-5 personalized travel destinations.

For each destination, provide its name, a brief description, a clear reason why it fits the user's criteria, suggested activities, the best time to visit, and an estimated cost indicator.

User Preferences: {{{preferences}}}
Budget: {{{budget}}}
Season: {{{season}}}`,
});

const aiDestinationSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiDestinationSuggestionsFlow',
    inputSchema: SuggestDestinationsInputSchema,
    outputSchema: SuggestDestinationsOutputSchema,
  },
  async input => {
    const {output} = await destinationSuggestionsPrompt(input);
    return output!;
  }
);
