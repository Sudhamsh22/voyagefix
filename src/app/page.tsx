import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ArrowRight, BrainCircuit, Users, Wallet } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DestinationCard from '@/components/features/destination-card';
import { Input } from '@/components/ui/input';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const popularDestinations = PlaceHolderImages.filter(d => ['paris', 'kyoto', 'santorini', 'new-york', 'maldives'].includes(d.id));
const popularPackages = PlaceHolderImages.filter(d => ['package-europe', 'package-asia', 'package-safari', 'package-islands'].includes(d.id));

const whyChooseUs = [
  {
    icon: BrainCircuit,
    title: 'AI-Powered Personalization',
    description: 'Our smart AI crafts unique itineraries based on your interests, budget, and travel style.',
  },
  {
    icon: Users,
    title: 'Seamless Collaboration',
    description: 'Plan trips together with friends and family in real-time, all in one place.',
  },
  {
    icon: Wallet,
    title: 'Best-Value Bookings',
    description: 'We search thousands of deals to find you the best prices on flights, hotels, and activities.',
  },
]

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
            Plan Your Next Journey with AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
            The ultimate AI-powered travel planner for creating personalized adventures.
          </p>
          <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="search"
              placeholder="Where do you want to go? e.g. 'adventure in Patagonia'"
              className="h-14 text-lg bg-background/80 backdrop-blur-sm border-2 border-transparent focus:border-primary"
            />
            <Button size="lg" asChild className="h-14">
                <Link href="/planner">
                    Start Planning <ArrowRight className="ml-2 h-5 w-5" />
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Popular Packages</h2>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {popularPackages.map((dest) => (
                <CarouselItem key={dest.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <DestinationCard destination={{...dest, name: dest.description}} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

       <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why Choose VoyageFlix?</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">We combine cutting-edge AI with expert curation to deliver your perfect trip.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {whyChooseUs.map((feature) => (
                    <div key={feature.title} className="text-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                            <feature.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
                        <p className="mt-2 text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </>
  );
}
