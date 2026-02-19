'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Star, MapPin, Plane, ExternalLink } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type DestinationCardProps = {
  destination: ImagePlaceholder;
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  const isRegion = destination.id.startsWith('region-');
  const name = destination.name || destination.id.charAt(0).toUpperCase() + destination.id.slice(1).replace(/-/g, ' ');

  if (isRegion) {
    return (
      <Card className={cn(
        "w-full overflow-hidden border-2 border-transparent bg-transparent group transition-all duration-300 ease-in-out hover:!scale-105 rounded-xl",
        destination.glowColor
      )}>
        <Link href={`/destinations/${destination.id}`} className="block h-full">
          <CardContent className="relative aspect-[3/4] p-0">
            <Image
              src={destination.imageUrl}
              alt={destination.description}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={destination.imageHint}
            />
            {/* Vignette and Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent rounded-lg transition-all duration-300 group-hover:from-black/95 group-hover:via-black/60" />
            <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]" />

            <Plane className="absolute top-4 right-4 h-6 w-6 text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute bottom-0 left-0 p-4 md:p-5 w-full text-white">
              <div className="transition-transform duration-300 group-hover:-translate-y-4">
                <h3 className="font-headline text-3xl font-bold">{name}</h3>
                <p className="text-sm text-white/80 mt-1 opacity-100 transition-opacity duration-300 group-hover:opacity-0">{destination.description}</p>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                 <p className="text-sm text-white/90 font-medium">{destination.description}</p>
                 <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/70 mt-2">
                    {destination.popularPlaces?.map(place => (
                        <span key={place} className="flex items-center gap-1">
                            <MapPin className="h-3 w-3"/> {place}
                        </span>
                    ))}
                 </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  // Original Destination Card for trending destinations, etc.
  return (
    <Card className="w-full overflow-hidden border-0 bg-transparent group transition-all duration-300 ease-in-out hover:!scale-105">
      <Link href={`/destinations/${destination.id}`} className="block h-full">
        <CardContent className="relative aspect-[3/4] p-0">
          <Image
            src={destination.imageUrl}
            alt={destination.description}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-primary/20"
            data-ai-hint={destination.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-lg" />
          <div className="absolute top-0 right-0 p-3 flex items-center gap-1">
            {destination.rating && (
                <>
                <Star className="w-4 h-4 text-accent-orange fill-accent-orange" />
                <span className="font-bold text-white text-sm">{destination.rating.toFixed(1)}</span>
                </>
            )}
          </div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-headline text-2xl font-bold text-white capitalize">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
                {destination.country && <p className="text-sm text-white/80">{destination.country}</p>}
                {destination.tourismLink && (
                    <a
                        href={destination.tourismLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={`Official tourism site for ${destination.country}`}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </a>
                )}
            </div>
            <div className="flex justify-between items-end mt-2">
                {destination.price ? (
                    <p className="text-lg font-bold text-white">From ${destination.price}</p>
                ) : <div />}
                {destination.tag && <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">{destination.tag}</Badge>}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
