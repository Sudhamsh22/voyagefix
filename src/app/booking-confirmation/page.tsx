'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, Plane, User, CreditCard, Train, Bus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    
    if (!dataString) {
        return (
            <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm text-center">
                <CardHeader>
                    <CardTitle>Booking Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>We couldn't find your booking details. Please try again.</p>
                     <Button asChild className="mt-4">
                        <Link href="/booking">Return to Booking</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    const bookingDetails = JSON.parse(decodeURIComponent(dataString));
    const { ticket, passenger, paymentLast4, bookingId } = bookingDetails;
    
    const transportMeta = {
        flight: { icon: Plane, label: 'Flight' },
        train: { icon: Train, label: 'Train' },
        bus: { icon: Bus, label: 'Bus' },
    };

    const MetaIcon = transportMeta[ticket.transport as 'flight' | 'train' | 'bus']?.icon || Plane;
    const metaLabel = transportMeta[ticket.transport as 'flight' | 'train' | 'bus']?.label || 'Trip';

    return (
        <Card className="w-full max-w-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center border-b border-white/10 pb-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl font-headline">Booking Confirmed!</CardTitle>
                <CardDescription>Your {metaLabel.toLowerCase()} is booked. Bon voyage!</CardDescription>
                <p className="font-mono text-sm text-primary pt-2">Booking ID: {bookingId}</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><MetaIcon className="h-5 w-5 text-primary" /> {metaLabel} Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-black/30 p-4 rounded-lg">
                        <p><strong>Operator:</strong> {ticket.operator}</p>
                        <p><strong>Route:</strong> Hyderabad → Dubai</p>
                        <p><strong>Departure:</strong> {ticket.departure}</p>
                        <p><strong>Arrival:</strong> {ticket.arrival}</p>
                        <p><strong>Class:</strong> {ticket.class}</p>
                        <p><strong>Price:</strong> {ticket.price}</p>
                        <p><strong>Number:</strong> {ticket.number}</p>
                        <p><strong>Details:</strong> {ticket.details}</p>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Passenger</h3>
                     <div className="bg-black/30 p-4 rounded-lg">
                        <p className="text-sm"><strong>Name:</strong> {passenger.name}</p>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Payment</h3>
                     <div className="bg-black/30 p-4 rounded-lg">
                        <p className="text-sm"><strong>Card Used:</strong> **** **** **** {paymentLast4}</p>
                    </div>
                </div>
                 <div className="text-center mt-8">
                     <Button asChild>
                        <Link href="/my-trips">View My Trips</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BookingConfirmationPage() {
    return (
        <main className="bg-gradient-to-b from-black via-[#0b0b0f] to-black min-h-screen pt-32 pb-12 flex items-center justify-center px-4">
            <Suspense fallback={<div className='text-white'>Loading confirmation...</div>}>
                <ConfirmationContent />
            </Suspense>
        </main>
    );
}
