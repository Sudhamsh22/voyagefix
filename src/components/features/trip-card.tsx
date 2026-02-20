'use client';

import type { AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { Button } from "../ui/button";
import { ArrowRight, Calendar, Users } from "lucide-react";

type SavedTrip = AIGeneratedItineraryOutput & {
    id: string;
    createdAt: { toDate: () => Date };
};

type TripCardProps = {
    trip: SavedTrip;
};

export default function TripCard({ trip }: TripCardProps) {
    const genericImages = PlaceHolderImages.filter(img => img.type === 'generic');
    let heroImageUrl: string;
    let heroImageHint: string;

    if (genericImages.length > 0) {
        const hash = trip.destination.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const index = hash % genericImages.length;
        const selectedImage = genericImages[index];
        heroImageUrl = selectedImage.imageUrl;
        heroImageHint = selectedImage.imageHint;
    } else {
        const fallbackImage = PlaceHolderImages.find((img) => img.id === 'hero');
        heroImageUrl = fallbackImage?.imageUrl || '';
        heroImageHint = fallbackImage?.imageHint || trip.destination;
    }
    
    const startDate = trip.itinerary.length > 0 ? parseISO(trip.itinerary[0].date) : new Date();

    return (
        <Card className="bg-card/50 backdrop-blur-sm overflow-hidden group border border-white/10 flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
            <div className="relative aspect-video">
                <Image
                    src={heroImageUrl}
                    alt={trip.destination}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={heroImageHint}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{trip.destination}</CardTitle>
                <CardDescription>{trip.tripSummary}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(startDate, 'MMM d, yyyy')}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{trip.travelers} Traveler(s)</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full group/btn">
                    View Itinerary <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
            </CardFooter>
        </Card>
    );
}
