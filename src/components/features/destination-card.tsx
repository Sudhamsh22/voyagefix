'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Star, ExternalLink } from 'lucide-react';
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
        <Link href="/planner" className="block group relative w-64 h-96 rounded-xl overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:z-10">
            <Image
              src={destination.imageUrl}
              alt={destination.description}
              fill
              sizes="(max-width: 768px) 50vw, 256px"
              className="object-cover"
              data-ai-hint={destination.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <h3 className="font-headline text-2xl font-bold">{name}</h3>
            </div>
        </Link>
    )
  }

  // Original Destination Card for trending destinations, etc.
  return (
    <Card className="w-full overflow-hidden border-0 bg-transparent group transition-all duration-300 ease-in-out hover:!scale-105">
      <Link href="/planner" className="block h-full">
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
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(destination.tourismLink, '_blank', 'noopener,noreferrer');
                        }}
                        className="text-white/70 hover:text-white transition-colors"
                        aria-label={`Official tourism site for ${destination.country}`}
                    >
                        <ExternalLink className="h-4 w-4" />
                    </button>
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
