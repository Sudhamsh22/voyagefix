'use client';

import { useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { Plane, Train, Bus, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Unified Ticket Interface
interface Ticket {
  id: number;
  operator: string;
  transport: 'flight' | 'train' | 'bus';
  number: string;
  details: string;
  departure: string;
  duration: string;
  arrival: string;
  class: string;
  price: string;
  priceValue: number;
}

const flightTickets: Ticket[] = [
    { id: 1, transport: 'flight', operator: "Emirates", number: "EK-57", details: "Non-stop", departure: "10:30", duration: "5h 10m", arrival: "13:40", class: "Business", price: "₹42,000", priceValue: 42000 },
    { id: 2, transport: 'flight', operator: "IndiGo", number: "6E-214", details: "1-stop", departure: "08:00", duration: "7h 30m", arrival: "15:30", class: "Economy", price: "₹25,000", priceValue: 25000 },
    { id: 3, transport: 'flight', operator: "Vistara", number: "UK-820", details: "Non-stop", departure: "12:15", duration: "5h 00m", arrival: "17:15", class: "Business", price: "₹45,000", priceValue: 45000 },
    { id: 4, transport: 'flight', operator: "Air India", number: "AI-951", details: "Non-stop", departure: "20:00", duration: "5h 15m", arrival: "01:15", class: "First Class", price: "₹85,000", priceValue: 85000 },
];

const trainTickets: Ticket[] = [
    { id: 5, transport: 'train', operator: "Rajdhani", number: "12951", details: "Sleeper AC", departure: "17:00", duration: "15h 40m", arrival: "08:40", class: "1st AC", price: "₹4,800", priceValue: 4800 },
    { id: 6, transport: 'train', operator: "Shatabdi", number: "12009", details: "Chair Car", departure: "06:00", duration: "8h 10m", arrival: "14:10", class: "Exec. Chair", price: "₹2,200", priceValue: 2200 },
    { id: 7, transport: 'train', operator: "Duronto", number: "12213", details: "3-Tier AC", departure: "22:10", duration: "16h 50m", arrival: "15:00", class: "3A", price: "₹3,500", priceValue: 3500 },
];

const busTickets: Ticket[] = [
    { id: 8, transport: 'bus', operator: "VRL Travels", number: "KA-09", details: "Volvo Multi-Axle", departure: "20:30", duration: "11h 00m", arrival: "07:30", class: "Sleeper", price: "₹1,200", priceValue: 1200 },
    { id: 9, transport: 'bus', operator: "RedBus", number: "TS-11", details: "AC Seater", departure: "21:00", duration: "12h 30m", arrival: "09:30", class: "Seater", price: "₹900", priceValue: 900 },
    { id: 10, transport: 'bus', operator: "Orange Travels", number: "AP-16", details: "Non-AC Sleeper", departure: "19:00", duration: "13h 15m", arrival: "08:15", class: "Sleeper", price: "₹850", priceValue: 850 },
];

const ticketsData = {
    flight: flightTickets,
    train: trainTickets,
    bus: busTickets,
};

export default function BookingPage() {
  const [transportType, setTransportType] = useState<'flight' | 'train' | 'bus'>('flight');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [passengerName, setPassengerName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const router = useRouter();
  const passengerDetailsRef = useRef<HTMLDivElement>(null);

  const displayTickets = useMemo(() => ticketsData[transportType], [transportType]);
  
  const handleTabChange = (type: 'flight' | 'train' | 'bus') => {
    setTransportType(type);
    setSelectedTicket(null);
  }

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setErrors({});
  };

  const handleContinue = () => {
    if (!selectedTicket) {
      toast({
        variant: "destructive",
        title: "No Ticket Selected",
        description: `Please select a ${transportType} before continuing.`,
      });
      return;
    }
    passengerDetailsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!passengerName.trim()) newErrors.passengerName = "Full Name is required.";
    if (!passportNumber.trim()) newErrors.passportNumber = "Passport/ID Number is required.";
    if (cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) newErrors.expiryDate = "Expiry must be in MM/YY format.";
    if (cvv.length !== 3) newErrors.cvv = "CVV must be 3 digits.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBookTicket = async () => {
    if (!selectedTicket) {
      toast({ variant: "destructive", title: "Please select a ticket first." });
      return;
    }
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Booking Successful!",
        description: `Your ${selectedTicket.transport} with ${selectedTicket.operator} is confirmed.`,
      });

      const bookingDetails = {
        ticket: selectedTicket,
        passenger: { name: passengerName },
        paymentLast4: cardNumber.slice(-4),
        bookingId: `VF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      router.push(`/booking-confirmation?data=${encodeURIComponent(JSON.stringify(bookingDetails))}`);
    }, 2000);
  };

  const tabs = [
    { type: 'flight', icon: Plane, label: 'Flights' },
    { type: 'train', icon: Train, label: 'Trains' },
    { type: 'bus', icon: Bus, label: 'Bus' },
  ];


  return (
    <main className="bg-gradient-to-b from-black via-[#0b0b0f] to-black min-h-screen pt-20">
      {/* Hero Banner (Route Preview) */}
      <section className="relative h-[40vh] flex items-end">
        <Image 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop" 
            alt="Dubai skyline from a plane window" 
            fill 
            className="object-cover" 
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-10 pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Hyderabad → Dubai
          </h1>
          <p className="text-gray-300 mt-2">
            12 Dec — 18 Dec • 2 Travelers
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-10">
        {/* Tabs: Flights | Trains | Bus */}
        <div className="mt-8 flex gap-6 border-b border-white/10">
            {tabs.map((tab) => (
                <button
                    key={tab.type}
                    onClick={() => handleTabChange(tab.type as 'flight' | 'train' | 'bus')}
                    className={cn(
                        "pb-2 flex items-center gap-2 transition-colors",
                        transportType === tab.type
                            ? "text-white font-semibold border-b-2 border-primary"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    <tab.icon className="h-5 w-5"/> {tab.label}
                </button>
            ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-12 gap-10 items-start">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Ticket Cards Row */}
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
            {displayTickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className={cn(
                  "flex-shrink-0 w-80 bg-white/5 border border-white/10 rounded-2xl p-5 transition",
                  selectedTicket?.id === ticket.id 
                    ? "border-primary/80 bg-white/10 shadow-lg shadow-primary/10"
                    : "hover:bg-white/10 hover:border-primary/50"
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white font-semibold">{ticket.operator}</div>
                  <div className="text-gray-400 text-sm">{ticket.details}</div>
                </div>
                <div className="flex items-center justify-between text-white text-lg font-semibold">
                  <span>{ticket.departure}</span>
                  <span className="text-gray-400 text-sm">{ticket.duration}</span>
                  <span>{ticket.arrival}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-400 text-sm">{ticket.class}</span>
                  <span className="text-primary font-bold">{ticket.price}</span>
                </div>
                <button 
                  onClick={() => handleSelectTicket(ticket)}
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition"
                >
                  {selectedTicket?.id === ticket.id ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          {/* Passenger Form */}
          <div ref={passengerDetailsRef} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">
              Passenger Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary w-full" placeholder="Full Name" />
                {errors.passengerName && <p className="text-destructive text-xs mt-1">{errors.passengerName}</p>}
              </div>
              <div>
                <input value={passportNumber} onChange={(e) => setPassportNumber(e.target.value)} className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary w-full" placeholder="Passport / ID Number" />
                {errors.passportNumber && <p className="text-destructive text-xs mt-1">{errors.passportNumber}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Selected Ticket Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">
              Selected Ticket
            </h3>
            {selectedTicket ? (
                <>
                <div className="text-gray-300 space-y-2 text-sm">
                    <p>Hyderabad → Dubai</p>
                    <p>{selectedTicket.operator} {selectedTicket.number}</p>
                    <p>{selectedTicket.departure} — {selectedTicket.arrival}</p>
                    <p>{selectedTicket.class}</p>
                </div>
                <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-white">
                    <span className="font-semibold">Total</span>
                    <span className="text-primary font-bold text-lg">{selectedTicket.price}</span>
                </div>
                <button onClick={handleContinue} className="w-full mt-6 bg-primary hover:bg-primary/90 py-3 rounded-xl text-white font-semibold transition">
                    Continue
                </button>
                </>
            ) : (
                <div className='text-center py-10'>
                    <p className='text-muted-foreground'>No ticket selected</p>
                </div>
            )}
          </div>

          {/* Payment Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">
              Payment
            </h3>
            <div className="space-y-3">
              <div>
                <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} className="w-full bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white mb-3 placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="Card Number" />
                {errors.cardNumber && <p className="text-destructive text-xs -mt-2 mb-2">{errors.cardNumber}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary w-full" placeholder="MM/YY" />
                  {errors.expiryDate && <p className="text-destructive text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <input value={cvv} onChange={(e) => setCvv(e.target.value)} className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary w-full" placeholder="CVV" />
                  {errors.cvv && <p className="text-destructive text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>
            </div>
            <button onClick={handleBookTicket} disabled={isLoading} className="w-full mt-6 bg-primary hover:bg-primary/90 py-3 rounded-xl text-white font-semibold transition flex items-center justify-center disabled:opacity-70">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Booking...' : 'Book Ticket'}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
