'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/auth/provider";

export default function MyTripsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
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

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
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
          <CardContent className="flex items-center justify-center text-center h-48 border-2 border-dashed rounded-lg">
            <div>
              <p className="text-muted-foreground">You have no upcoming trips.</p>
              <p className="text-muted-foreground">Time to plan your next adventure!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Past Trips</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No travel history yet.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Itineraries</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You have no saved itineraries.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
