import { type AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, MapPin, Bus, Calendar, Activity, Users, Plane, ArrowRight } from "lucide-react";
import Image from "next/image";
import { differenceInDays, format, parseISO } from 'date-fns';
import { PlaceHolderImages } from "@/lib/placeholder-images";

type ItineraryDisplayProps = {
    itinerary: AIGeneratedItineraryOutput;
};

const StatCard = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="bg-background/30 p-3 rounded-lg flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-bold text-lg text-foreground">{value}</p>
        </div>
    </div>
);

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const genericImages = PlaceHolderImages.filter(img => img.type === 'generic');
  let heroImageUrl: string;
  let heroImageHint: string;

  if (genericImages.length > 0) {
    // Deterministically pick an image based on the destination name
    const hash = itinerary.destination.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const index = hash % genericImages.length;
    const selectedImage = genericImages[index];
    heroImageUrl = selectedImage.imageUrl;
    heroImageHint = selectedImage.imageHint;
  } else {
    // Fallback to the main hero image if no generic images are available
    const fallbackImage = PlaceHolderImages.find((img) => img.id === 'hero');
    heroImageUrl = fallbackImage?.imageUrl || ''; // Provide a final empty string fallback
    heroImageHint = fallbackImage?.imageHint || itinerary.destination;
  }

  const startDate = parseISO(itinerary.itinerary[0].date);
  const endDate = parseISO(itinerary.itinerary[itinerary.itinerary.length - 1].date);
  const duration = differenceInDays(endDate, startDate) + 1;
  const totalActivities = itinerary.itinerary.reduce((acc, day) => acc + day.activities.length, 0);

  return (
    <Card className="bg-white/5 backdrop-blur-xl overflow-hidden border border-white/10 rounded-2xl">
        <div className="p-6 bg-black/20 border-b border-white/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                    <span className="font-mono text-2xl font-bold">JFK</span>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <span className="font-mono text-2xl font-bold">{itinerary.destination.substring(0, 3).toUpperCase()}</span>
                </div>
                <div className="text-right">
                    <p className="font-mono text-lg font-bold text-white">{format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}</p>
                    <p className="text-xs text-muted-foreground">FLIGHT VF-2024</p>
                </div>
            </div>
        </div>
        <div className="relative h-48 w-full">
            <Image 
                src={heroImageUrl}
                alt={`Image of ${itinerary.destination}`}
                fill
                className="object-cover"
                data-ai-hint={heroImageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md h-full">
                    <MapPin className="text-white h-8 w-8 absolute top-1/2 -translate-y-1/2 left-12" fill="currentColor" />
                    <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                        <path d="M 50 50 Q 200 -20 350 50" stroke="hsl(var(--primary))" fill="none" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                    <Plane className="text-white h-6 w-6 absolute top-1/2 -translate-y-1/2 right-12" />
                </div>
            </div>
        </div>
        
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-white/10">
            <StatCard icon={Calendar} label="Duration" value={`${duration} Days`} />
            <StatCard icon={Users} label="Travelers" value={itinerary.travelers} />
            <StatCard icon={Activity} label="Activities" value={totalActivities} />
            <StatCard icon={DollarSign} label="Est. Cost" value={itinerary.totalEstimatedCost?.split(' ')[0] || "N/A"} />
        </div>

        <CardContent className="p-6">
            <p className="font-headline text-xl text-foreground mb-4">Itinerary Details</p>
             <Accordion type="single" collapsible defaultValue={`day-1`}>
                {itinerary.itinerary.map((day) => (
                    <AccordionItem value={`day-${day.day}`} key={day.day}>
                        <AccordionTrigger className="text-lg font-headline hover:no-underline">
                            <div className="flex items-center gap-4">
                                <span className="font-mono bg-primary/20 text-primary px-2 py-1 rounded-md">DAY {day.day}</span>
                                <Badge variant="secondary">{new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Badge>
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
