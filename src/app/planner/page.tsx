"use client";

import { useState } from "react";
import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import ItineraryDisplay from "./components/itinerary-display";
import PlannerForm from "./components/planner-form";
import { Sparkles, Plane } from "lucide-react";

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
    <main className="bg-gradient-to-b from-black via-[#0b0b0f] to-black min-h-screen">
      <section className="pt-32 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
          Flight Planning Console
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Design your journey like a pilot. Configure your flight plan and let AI generate the optimal route.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-10 pb-24">
        <div className="grid grid-cols-12 gap-10 items-start">
          <div className="col-span-12 lg:col-span-4">
            <PlannerForm onItineraryGenerated={handleItineraryGenerated} isLoading={isLoading} />
          </div>
          <div className="col-span-12 lg:col-span-8">
            {isLoading && (
              <div className="bg-white/5 border border-white/10 rounded-2xl h-[520px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse mb-4" />
                  <p className="text-white font-semibold text-lg">Generating your adventure...</p>
                  <p className="text-gray-400 text-sm mt-2">This might take a moment.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 rounded-2xl h-[520px] flex items-center justify-center relative overflow-hidden p-8">
                <div className="text-center">
                   <p className="text-destructive-foreground font-semibold">Error Generating Itinerary</p>
                   <p className="text-destructive-foreground/80 text-sm mt-2">{error}</p>
                </div>
              </div>
            )}
            {itinerary && !isLoading && !error && (
              <ItineraryDisplay itinerary={itinerary} />
            )}
            {!itinerary && !isLoading && !error && (
              <div className="bg-white/5 border border-white/10 rounded-2xl h-[520px] flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plane className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-white font-semibold">
                    Awaiting Flight Plan
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Configure your trip to generate a route
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
