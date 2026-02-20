'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/provider";
import { useFirestore } from "@/firebase/provider";
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { AIGeneratedItineraryOutput } from "@/ai/flows/ai-generated-itinerary";
import TripCard from "@/components/features/trip-card";

type SavedTrip = AIGeneratedItineraryOutput & {
    id: string;
    createdAt: { toDate: () => Date };
};


export default function MyTripsPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const db = useFirestore();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading, router]);

  useEffect(() => {
    if (user && user.email && db) {
      const fetchTrips = async () => {
        setIsLoading(true);
        try {
            const tripsCol = collection(db, 'trips');
            const q = query(tripsCol, where("userEmail", "==", user.email), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const fetchedTrips = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as SavedTrip[];
            setTrips(fetchedTrips);
        } catch (error) {
            console.error("Error fetching trips: ", error);
        } finally {
            setIsLoading(false);
        }
      };
      fetchTrips();
    } else if (!isAuthLoading) {
      setIsLoading(false);
    }
  }, [user, db, isAuthLoading]);

  const pageLoading = isAuthLoading || isLoading;

  if (pageLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 pt-32 pb-12 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center justify-center">
                <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                <p className="mt-4 text-lg font-semibold font-headline">Loading your trips...</p>
            </div>
        </div>
    );
  }

  if (!user) {
    return null;
  }

  const upcomingTrips = trips.filter(trip => trip.itinerary.length > 0 && new Date(trip.itinerary[0].date) >= new Date());
  const pastTrips = trips.filter(trip => trip.itinerary.length > 0 && new Date(trip.itinerary[0].date) < new Date());


  return (
    <div className="container mx-auto px-4 md:px-6 pt-32 pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-headline">My Trips</h1>
        <Button asChild>
          <Link href="/planner">
            <Plus className="mr-2 h-4 w-4" /> Plan a New Trip
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTrips.length === 0 ? (
                <div className="flex items-center justify-center text-center h-48 border-2 border-dashed rounded-lg">
                    <div>
                        <p className="text-muted-foreground">You have no upcoming trips.</p>
                        <p className="text-muted-foreground">Time to plan your next adventure!</p>
                    </div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Trips</CardTitle>
          </CardHeader>
          <CardContent>
            {pastTrips.length === 0 ? (
                 <div className="flex items-center justify-center text-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No travel history yet.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
