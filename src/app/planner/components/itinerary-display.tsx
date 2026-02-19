import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MapPin, Bus } from "lucide-react";

type ItineraryDisplayProps = {
    itinerary: AIGeneratedItineraryOutput;
};

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Your Custom Itinerary</CardTitle>
            <CardDescription>{itinerary.tripSummary}</CardDescription>
            {itinerary.totalEstimatedCost && <p className="text-lg font-bold pt-2">Total Estimated Cost: {itinerary.totalEstimatedCost}</p>}
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
