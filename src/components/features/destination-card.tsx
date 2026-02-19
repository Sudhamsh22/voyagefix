import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type DestinationCardProps = {
  destination: ImagePlaceholder & { name?: string };
};

export default function DestinationCard({ destination }: DestinationCardProps) {
  const name = destination.name || destination.id.charAt(0).toUpperCase() + destination.id.slice(1).replace(/-/g, ' ');
  
  return (
    <Card className="w-full overflow-hidden border-0 bg-card group transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 rounded-lg">
      <Link href={`/destinations/${destination.id}`}>
        <CardContent className="relative aspect-[3/4] p-0">
          <Image
            src={destination.imageUrl}
            alt={destination.description}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            data-ai-hint={destination.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="font-headline text-2xl font-bold text-white capitalize">{name}</h3>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
