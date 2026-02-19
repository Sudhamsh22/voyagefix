'use server';
/**
 * @fileOverview A Genkit flow for generating a detailed day-by-day travel itinerary based on user preferences.
 *
 * - aiGeneratedItinerary - A function that handles the AI itinerary generation process.
 * - AIGeneratedItineraryInput - The input type for the aiGeneratedItinerary function.
 * - AIGeneratedItineraryOutput - The return type for the aiGeneratedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AIGeneratedItineraryInputSchema = z.object({
  destination: z.string().describe('The desired travel destination (e.g., "Paris, France").'),
  startDate: z.string().describe('The start date of the trip in YYYY-MM-DD format (e.g., "2024-08-01").'),
  endDate: z.string().describe('The end date of the trip in YYYY-MM-DD format (e.g., "2024-08-07").'),
  budget: z.enum(['budget-friendly', 'moderate', 'luxury']).describe('The desired budget for the trip.'),
  interests: z.array(z.string()).describe('A list of user interests (e.g., ["culture", "food", "adventure", "relaxation"]).'),
  travelers: z.number().int().min(1).describe('The number of travelers.'),
});
export type AIGeneratedItineraryInput = z.infer<typeof AIGeneratedItineraryInputSchema>;

// Output Schema
const ItineraryActivitySchema = z.object({
  time: z.string().describe('The suggested time for the activity (e.g., "9:00 AM", "Afternoon").'),
  name: z.string().describe('The name of the activity or point of interest.'),
  description: z.string().describe('A brief description of the activity.'),
  location: z.string().optional().describe('The specific location or address of the activity.'),
  estimatedCostPerPerson: z.string().optional().describe('The estimated cost per person for this activity (e.g., "$30 for entry").'),
  transportation: z.string().optional().describe('Suggested transportation to get to this activity (e.g., "Metro line 9", "Walk").'),
});

const ItineraryDaySchema = z.object({
  day: z.number().int().min(1).describe('The day number of the trip.'),
  date: z.string().describe('The date for this day of the trip in YYYY-MM-DD format.'),
  dailySummary: z.string().describe('A brief summary of the day\'s plan.'),
  activities: z.array(ItineraryActivitySchema).describe('A list of activities and points of interest for the day.'),
});

const AIGeneratedItineraryOutputSchema = z.object({
  destination: z.string().describe('The travel destination city and country.'),
  tripSummary: z.string().describe('An overall summary of the generated trip itinerary.'),
  totalEstimatedCost: z.string().optional().describe('The estimated total cost for the entire trip (e.g., "$2000 per person, excluding flights/accommodation").'),
  itinerary: z.array(ItineraryDaySchema).describe('A detailed day-by-day itinerary.'),
  travelers: z.number().int().min(1).describe('The original number of travelers from the input.'),
});
export type AIGeneratedItineraryOutput = z.infer<typeof AIGeneratedItineraryOutputSchema>;

export async function aiGeneratedItinerary(input: AIGeneratedItineraryInput): Promise<AIGeneratedItineraryOutput> {
  return aiGeneratedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGeneratedItineraryPrompt',
  input: {schema: AIGeneratedItineraryInputSchema},
  output: {schema: AIGeneratedItineraryOutputSchema},
  prompt: `You are an expert travel agent specializing in creating personalized, detailed day-by-day itineraries. Your goal is to generate an engaging and practical travel plan based on the user's preferences.\n\nHere are the details for the trip:\nDestination: {{{destination}}}\nStart Date: {{{startDate}}}\nEnd Date: {{{endDate}}}\nBudget: {{{budget}}}\nInterests: {{{interests}}}\nNumber of Travelers: {{{travelers}}}\n\nPlease generate a detailed day-by-day itinerary for the trip.\nEach day should include a summary and a list of specific activities, including estimated times, names, descriptions, locations (if applicable), estimated cost per person for that activity, and suggested transportation.\nThe itinerary should cover the entire duration from the start date to the end date.\nAlso, provide an overall trip summary and an estimated total cost for the entire trip (excluding flights and primary accommodation, focusing on activities, food, and local transport).\nReturn the original destination name in the 'destination' field.\nAlso, return the original number of travelers in the 'travelers' field.\n\nEnsure the output is a JSON object matching the provided output schema.`,
});

const aiGeneratedItineraryFlow = ai.defineFlow(
  {
    name: 'aiGeneratedItineraryFlow',
    inputSchema: AIGeneratedItineraryInputSchema,
    outputSchema: AIGeneratedItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
