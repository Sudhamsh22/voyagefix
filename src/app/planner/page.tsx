"use client";

import { useState } from "react";
import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import ItineraryDisplay from "./components/itinerary-display";
import PlannerForm from "./components/planner-form";
import { Globe, Plane, Sparkles } from "lucide-react";

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
        <h1 className="text-4xl md:text-6xl font-bold font-headline">Flight Planning Console</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Design your journey like a pilot. Configure your flight plan and let our AI engine generate the optimal route and itinerary.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[450px_1fr] gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-1">
          <PlannerForm onItineraryGenerated={handleItineraryGenerated} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-card/50 rounded-lg">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
              <p className="mt-4 text-lg font-semibold font-headline">Generating your adventure...</p>
              <p className="text-muted-foreground">This might take a moment.</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-card/50 rounded-lg">
              <p className="text-destructive-foreground bg-destructive p-4 rounded-md">Error: {error}</p>
            </div>
          )}
          {itinerary && !isLoading && !error && (
            <ItineraryDisplay itinerary={itinerary} />
          )}
          {!itinerary && !isLoading && !error && (
             <div className="flex flex-col items-center justify-center h-full min-h-[600px] bg-card/50 rounded-xl p-8 text-center border-2 border-dashed border-border/30 relative overflow-hidden">
                <Globe className="h-48 w-48 text-muted-foreground/10 absolute -top-12 -left-12 opacity-50" />
                <div className="relative z-10">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                        <Plane className="h-8 w-8"/>
                    </div>
                    <p className="mt-4 text-xl font-semibold font-headline text-foreground">Awaiting Flight Plan</p>
                    <p className="text-muted-foreground mt-2">Configure your trip parameters to generate a route.</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
