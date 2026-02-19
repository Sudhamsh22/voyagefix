"use client";

import { useState } from "react";
import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import ItineraryDisplay from "./components/itinerary-display";
import PlannerForm from "./components/planner-form";
import { Bot, Sparkles } from "lucide-react";

export default function AIPlannerPage() {
  const [itinerary, setItinerary] = useState<AIGeneratedItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleItineraryGenerated = (data: AIGeneratedItineraryOutput | null, loading: boolean, err: string | null) => {
    setItinerary(data);
    setIsLoading(loading);
    setError(err);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-headline">AI Trip Planner</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Craft your dream vacation in seconds. Just fill out the form below and let our AI create a personalized itinerary for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-1">
          <PlannerForm onItineraryGenerated={handleItineraryGenerated} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-card/50 rounded-lg">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              <p className="mt-4 text-lg font-semibold font-headline">Generating your adventure...</p>
              <p className="text-muted-foreground">This might take a moment.</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-card/50 rounded-lg">
              <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Error: {error}</p>
            </div>
          )}
          {itinerary && !isLoading && !error && (
            <ItineraryDisplay itinerary={itinerary} />
          )}
          {!itinerary && !isLoading && !error && (
             <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-card/50 rounded-lg p-8 text-center border-2 border-dashed">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 text-lg font-semibold font-headline">Your personalized itinerary will appear here.</p>
              <p className="text-muted-foreground">Fill out the form to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
