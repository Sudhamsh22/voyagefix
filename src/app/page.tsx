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
import { ArrowRight, BrainCircuit, Building2, Calendar, Check, Gem, Globe, Landmark, MapPin, Mountain, Plane, Sparkles, Sprout, Star, Users, Wallet, Waves } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import DestinationCard from '@/components/features/destination-card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const popularDestinations = PlaceHolderImages.filter(d => ['paris', 'kyoto', 'santorini', 'new-york', 'maldives'].includes(d.id));
const regions = PlaceHolderImages.filter(d => d.id.startsWith('region-'));
const tripStyles = [
  { id: 'style-beach', name: 'Beach', icon: Waves, type: 'plane' },
  { id: 'style-adventure', name: 'Adventure', icon: Mountain, type: 'train' },
  { id: 'style-culture', name: 'Culture', icon: Landmark, type: 'plane' },
  { id: 'style-luxury', name: 'Luxury', icon: Gem, type: 'plane' },
  { id: 'style-nature', name: 'Nature', icon: Sprout, type: 'train' },
  { id: 'style-city', name: 'City', icon: Building2, type: 'plane' },
];
const tripStyleImages = PlaceHolderImages.filter(d => d.id.startsWith('style-'));
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
];

export default function Home() {
  const sampleItineraryImage = PlaceHolderImages.find((img) => img.id === 'sample-itinerary-italy');
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[90vh] w-full flex items-center justify-center text-center text-white">
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
          <Badge className='bg-white/20 backdrop-blur-sm text-white border-0 mb-4'>
            📍 Tuscany, Italy
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
            Plan Your Next Journey with AI
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-foreground/80">
            Adventure • Vineyards • Scenic Drives
          </p>
          
          {/* Travel Search Bar */}
          <div className="mt-8 max-w-4xl mx-auto p-4 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4">
              <div className="md:col-span-2 flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                <MapPin className="text-primary" />
                <Input type="text" placeholder="Where to?" className="bg-transparent border-0 text-white placeholder:text-white/70 focus-visible:ring-0" />
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                <Calendar className="text-primary" />
                <Input type="text" placeholder="Dates" className="bg-transparent border-0 text-white placeholder:text-white/70 focus-visible:ring-0" />
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-3 rounded-lg">
                <Users className="text-primary" />
                <Input type="number" placeholder="Travelers" className="bg-transparent border-0 text-white placeholder:text-white/70 focus-visible:ring-0" />
              </div>
              <Button size="lg" asChild className="h-full group">
                <Link href="/planner">
                    Start Planning <Plane className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Region */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full relative"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div className="text-left">
                <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-3">
                  <Globe className="w-8 h-8 text-primary" />
                  Explore the World by Region
                </h2>
                <p className="mt-2 text-muted-foreground max-w-lg">
                  Discover destinations across continents, each with its unique
                  charm and adventures.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CarouselPrevious className="relative -left-0 -top-0 -translate-y-0" />
                <CarouselNext className="relative -right-0 -top-0 -translate-y-0" />
              </div>
            </div>

            <CarouselContent className="-ml-4">
              {regions.map((region) => (
                <CarouselItem
                  key={region.id}
                  className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <DestinationCard destination={region} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
      
      {/* Trending Destinations */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-8">Trending Destinations</h2>
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {popularDestinations.map((dest) => (
                <CarouselItem key={dest.id} className="pl-4 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <DestinationCard destination={dest} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Trip Styles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-12">Find Your Trip Style</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
            {tripStyles.map(style => {
              const image = tripStyleImages.find(img => img.id === style.id);
              if (!image) return null;

              const isTrain = style.type === 'train';

              return (
                <Link href="/planner" key={style.name} className="group relative flex flex-col items-center gap-4 cursor-pointer no-underline">
                  {/* Window Frame */}
                  <div className={cn(
                    "relative aspect-[3/4] w-full bg-slate-900 border-4 border-slate-700/50 shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/20",
                    isTrain ? "rounded-2xl" : "rounded-[2.5rem]"
                  )}>
                    {/* Image inside */}
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                      data-ai-hint={image.imageHint}
                    />
                    {/* Inner Frame & Effects */}
                    <div className={cn(
                      "absolute inset-0 shadow-[inset_0_0_20px_10px_rgba(0,0,0,0.8)] ring-4 ring-inset ring-black/50 transition-all duration-300 group-hover:ring-primary/50",
                      isTrain ? "rounded-[14px]" : "rounded-[2.2rem]"
                    )} />
                    {/* Reflection */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-white/0 to-white/5 opacity-50 -rotate-45 transition-opacity duration-300 group-hover:opacity-20" />
                  </div>

                  {/* Label */}
                  <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:-translate-y-2">
                    <style.icon className="w-8 h-8 text-primary" />
                    <p className="font-bold font-headline text-lg text-foreground">{style.name}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Planner Section */}
      <section className="py-16 md:py-24 bg-accent-blue/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Your Personal Travel AI</h2>
              <p className="mt-4 text-muted-foreground max-w-lg">Tired of endless searching? Our AI crafts a complete, personalized itinerary in seconds. Just tell us your dream, and we'll handle the details.</p>
              <Button size="lg" asChild className="mt-8 group">
                <Link href="/planner">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Your Trip <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className='bg-black/20 p-6 rounded-lg shadow-2xl'>
                <p className='font-mono text-sm text-green-400'>&gt; Generating trip to Italy...</p>
                <p className='font-mono text-sm mt-2 text-white/90'><span className='text-cyan-400'>Day 1:</span> Arrive in Rome, check into hotel. Evening walk to the Trevi Fountain.</p>
                <p className='font-mono text-sm mt-2 text-white/90'><span className='text-cyan-400'>Day 2:</span> Explore the Colosseum and Roman Forum. Pasta-making class in Trastevere.</p>
                <p className='font-mono text-sm mt-2 text-white/90'><span className='text-cyan-400'>Day 3:</span> Vatican City: St. Peter's Basilica & a special tour of the Vatican Museums.</p>
                <div className='w-full bg-slate-700 h-2 rounded-full mt-4 overflow-hidden'><div className='bg-primary h-2 w-3/4 animate-pulse'></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Itinerary */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <Card className="bg-gradient-to-r from-accent-orange/10 to-primary/10 border-0 overflow-hidden">
                <div className="grid md:grid-cols-2 items-center">
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl md:text-4xl font-bold font-headline">7-Day Italy Escape</h2>
                        <p className="mt-2 text-muted-foreground">From the ancient ruins of Rome to the rolling hills of Tuscany, experience the best of Italy.</p>
                        <ul className="mt-4 space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2"><Check className="text-primary h-5 w-5" /> Day 1-3: Ancient Rome & Vatican City</li>
                            <li className="flex items-center gap-2"><Check className="text-primary h-5 w-5" /> Day 4-5: Art & Culture in Florence</li>
                            <li className="flex items-center gap-2"><Check className="text-primary h-5 w-5" /> Day 6-7: Tuscan Wine Country</li>
                        </ul>
                        <Button size="lg" asChild className="mt-8 group">
                            <Link href="/planner">
                                View Full Plan <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                    <div className="relative h-64 md:h-full min-h-[300px]">
                        {sampleItineraryImage && (
                            <Image 
                                src={sampleItineraryImage.imageUrl} 
                                alt={sampleItineraryImage.description} 
                                fill 
                                className="object-cover"
                                data-ai-hint={sampleItineraryImage.imageHint}
                            />
                        )}
                    </div>
                </div>
            </Card>
        </div>
      </section>

       {/* Why Choose Us */}
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
