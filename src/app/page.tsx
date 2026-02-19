import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight, Search } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DestinationCard from '@/components/features/destination-card';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const popularDestinations = PlaceHolderImages.filter(d => ['paris', 'kyoto', 'santorini', 'new-york', 'maldives'].includes(d.id));

export default function Home() {
  return (
    <>
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
            Your Story, Your Adventure
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
            Discover and book your next trip with our AI-powered travel platform.
          </p>
          <div className="mt-8 max-w-xl mx-auto">
            <form className="relative">
              <Input
                type="search"
                placeholder="Search for a destination (e.g., 'Paris')"
                className="h-14 pl-12 pr-4 text-lg bg-background/80 backdrop-blur-sm border-2 border-transparent focus:border-primary"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Let AI Plan Your Perfect Trip</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Just tell us your preferences and we'll generate a custom itinerary for you.</p>
              <div className="mt-8">
                  <Button size="lg" asChild>
                      <Link href="/planner">
                          Start Planning with AI <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                  </Button>
              </div>
          </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Trending Destinations</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularDestinations.map((dest) => (
                <CarouselItem key={dest.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <DestinationCard destination={{...dest, name: dest.id.charAt(0).toUpperCase() + dest.id.slice(1)}} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>
    </>
  );
}
