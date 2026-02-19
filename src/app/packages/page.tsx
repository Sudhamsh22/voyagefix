import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Star, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const packages = PlaceHolderImages.filter(p => p.id.startsWith('package-'));

export default function PackagesPage() {
  // A generic hero image for the packages page.
  const heroImage = {
    imageUrl: "https://images.unsplash.com/photo-1505832688684-f7a3036a18a5?q=80&w=2070&auto=format&fit=crop",
    description: "Backpack and map on a wooden table for travel planning",
    imageHint: "travel planning adventure",
  };

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          data-ai-hint={heroImage.imageHint}
          priority
        />
        <div className="relative z-20 container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
            Our Curated Travel Packages
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/80">
            Hand-picked adventures for every type of traveler. Your next story awaits.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="bg-card/50 backdrop-blur-sm overflow-hidden group border border-white/10 flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                <div className="relative aspect-video">
                  <Image
                    src={pkg.imageUrl}
                    alt={pkg.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint={pkg.imageHint}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                   <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full text-white">
                    {pkg.rating && (
                        <>
                        <Star className="w-4 h-4 text-accent-orange fill-accent-orange" />
                        <span className="font-bold text-sm">{pkg.rating.toFixed(1)}</span>
                        </>
                    )}
                  </div>
                </div>
                <CardHeader>
                  {pkg.tag && <Badge variant="secondary" className="w-fit mb-2 bg-primary/10 text-primary-foreground">{pkg.tag}</Badge>}
                  <CardTitle className="font-headline text-2xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                   <div className="flex justify-between items-center text-muted-foreground text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.id.includes('safari') ? '10 Days' : '7-14 Days'}</span>
                      </div>
                      <div className="font-bold text-lg text-foreground">
                        ${pkg.price}
                      </div>
                   </div>
                </CardContent>
                <CardFooter>
                   <Button asChild className="w-full group/btn">
                        <Link href="/planner">
                            View Package <ArrowRight className="ml-auto h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                    </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}