import { suggestDestinations } from "@/ai/flows/ai-destination-suggestions";
import DestinationCard from "@/components/features/destination-card";
import { ImagePlaceholder } from "@/lib/placeholder-images";

const vibes = [
  { name: "Romantic Getaways", preferences: ["romance", "couples", "scenic"] },
  { name: "Thrilling Adventures", preferences: ["adventure", "hiking", "outdoors"] },
  { name: "Luxury Escapes", preferences: ["luxury", "fine dining", "relaxation"] },
  { name: "Family Fun", preferences: ["family-friendly", "activities", "safe"] },
];

async function getVibeDestinations(preferences: string[]) {
  try {
    const result = await suggestDestinations({
      preferences,
      budget: "moderate",
      season: "any",
    });
    if (!result || !result.destinations) return [];

    return result.destinations.map((dest) => ({
      id: dest.name.toLowerCase().replace(/\s+/g, '-'),
      name: dest.name,
      description: dest.description,
      imageUrl: `https://picsum.photos/seed/${dest.name.replace(/[^a-zA-Z0-9]/g, '')}/${400}/${600}`,
      imageHint: dest.activities[0] || dest.name,
    }));
  } catch (e) {
    console.error("Failed to fetch destinations for vibe:", preferences, e);
    return [];
  }
}

export default async function DestinationsPage() {
  const allVibeDestinations = await Promise.all(
    vibes.map(vibe => getVibeDestinations(vibe.preferences))
  );

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="space-y-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">Explore Destinations</h1>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">Find your next adventure, inspired by your mood.</p>
        </div>

        {vibes.map((vibe, index) => {
          const destinations = allVibeDestinations[index];
          if (!destinations || destinations.length === 0) return null;

          return (
            <section key={vibe.name}>
              <h2 className="text-3xl font-bold font-headline mb-8">{vibe.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {destinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest as ImagePlaceholder & {name?:string}} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
