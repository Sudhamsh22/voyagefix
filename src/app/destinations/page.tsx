import DestinationCard from "@/components/features/destination-card";
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

const vibeSections = [
  {
    name: "Romantic Getaways",
    destinations: PlaceHolderImages.filter(d => ['santorini', 'paris', 'maldives', 'generic-dest-1'].includes(d.id))
  },
  {
    name: "Thrilling Adventures",
    destinations: PlaceHolderImages.filter(d => ['generic-dest-2', 'generic-dest-8', 'generic-dest-9', 'package-asia'].includes(d.id))
  },
  {
    name: "Luxury Escapes",
    destinations: PlaceHolderImages.filter(d => ['maldives', 'santorini', 'package-safari', 'style-luxury'].includes(d.id))
  },
  {
    name: "Family Fun",
    destinations: PlaceHolderImages.filter(d => ['new-york', 'package-europe', 'generic-dest-7', 'style-city'].includes(d.id))
  },
];


export default function DestinationsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="space-y-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore Destinations</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Find your next adventure, inspired by your mood.</p>
        </div>

        {vibeSections.map((section) => {
          if (!section.destinations || section.destinations.length === 0) return null;

          return (
            <section key={section.name}>
              <h2 className="text-3xl font-bold font-headline mb-8">{section.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {section.destinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest as ImagePlaceholder} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
