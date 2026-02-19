import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MapPin, Bus } from "lucide-react";
import Image from "next/image";

type ItineraryDisplayProps = {
    itinerary: AIGeneratedItineraryOutput;
};

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const heroImageUrl = `https://picsum.photos/seed/${itinerary.destination.replace(/[^a-zA-Z0-9]/g, '')}/${1200}/${400}`;

  return (
    <Card className="bg-card/50 backdrop-blur-sm overflow-hidden">
        <div className="relative h-64 w-full">
            <Image 
                src={heroImageUrl}
                alt={`Image of ${itinerary.destination}`}
                fill
                className="object-cover"
                data-ai-hint={itinerary.destination}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
                <h2 className="font-headline text-4xl font-bold text-white">{itinerary.destination}</h2>
                <p className="text-white/80 max-w-2xl mt-1">{itinerary.tripSummary}</p>
            </div>
        </div>
        <CardHeader className="pt-6">
            {itinerary.totalEstimatedCost && <p className="text-lg font-bold">Total Estimated Cost: {itinerary.totalEstimatedCost}</p>}
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible defaultValue={`day-1`}>
                {itinerary.itinerary.map((day) => (
                    <AccordionItem value={`day-${day.day}`} key={day.day}>
                        <AccordionTrigger className="text-xl font-headline hover:no-underline">
                            <div className="flex items-center gap-4">
                                <span>Day {day.day}</span>
                                <Badge variant="secondary">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-2">
                            <p className="italic text-muted-foreground mb-6">{day.dailySummary}</p>
                            <div className="space-y-8 border-l-2 border-primary/50 ml-2 pl-8 relative">
                                {day.activities.map((activity, index) => (
                                    <div key={index} className="relative">
                                        <div className="absolute -left-[42px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                                        <p className="font-bold text-lg">{activity.name}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {activity.time}</span>
                                            {activity.location && <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {activity.location}</span>}
                                            {activity.estimatedCostPerPerson && <span className="flex items-center gap-1.5"><DollarSign className="h-3 w-3" /> {activity.estimatedCostPerPerson}</span>}
                                            {activity.transportation && <span className="flex items-center gap-1.5"><Bus className="h-3 w-3" /> {activity.transportation}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
    </Card>
  )
}
