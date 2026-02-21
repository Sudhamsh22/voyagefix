import Image from "next/image";
import { Plane, Train } from "lucide-react";

export default function BookingPage() {
  const tickets = [
    { id: 1, airline: "Emirates", type: "Non-stop", departure: "10:30", duration: "5h 10m", arrival: "13:40", class: "Business", price: "₹42,000" },
    { id: 2, airline: "IndiGo", type: "1-stop", departure: "08:00", duration: "7h 30m", arrival: "15:30", class: "Economy", price: "₹25,000" },
    { id: 3, airline: "Vistara", type: "Non-stop", departure: "12:15", duration: "5h 00m", arrival: "17:15", class: "Business", price: "₹45,000" },
    { id: 4, airline: "Air India", type: "Non-stop", departure: "20:00", duration: "5h 15m", arrival: "01:15", class: "First Class", price: "₹85,000" },
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
        {/* Tabs: Flights | Trains */}
        <div className="mt-8 flex gap-6 border-b border-white/10">
            <button className="text-white font-semibold border-b-2 border-primary pb-2 flex items-center gap-2">
                <Plane className="h-5 w-5"/> Flights
            </button>
            <button className="text-gray-400 hover:text-white pb-2 flex items-center gap-2 transition-colors">
                <Train className="h-5 w-5"/> Trains
            </button>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-12 gap-10 items-start">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Ticket Cards Row */}
          <div className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex-shrink-0 w-80 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition hover:border-primary/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-white font-semibold">{ticket.airline}</div>
                  <div className="text-gray-400 text-sm">{ticket.type}</div>
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
                <button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition">
                  Select
                </button>
              </div>
            ))}
          </div>

          {/* Passenger Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">
              Passenger Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="Full Name" />
              <input className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="Passport Number" />
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
            <div className="text-gray-300 space-y-2 text-sm">
              <p>Hyderabad → Dubai</p>
              <p>Emirates EK-57</p>
              <p>10:30 — 13:40</p>
              <p>Business Class</p>
            </div>
            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-white">
              <span className="font-semibold">Total</span>
              <span className="text-primary font-bold text-lg">₹42,000</span>
            </div>
            <button className="w-full mt-6 bg-primary hover:bg-primary/90 py-3 rounded-xl text-white font-semibold transition">
              Continue
            </button>
          </div>

          {/* Payment Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold text-xl mb-4">
              Payment
            </h3>
            <div className="space-y-3">
              <input className="w-full bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white mb-3 placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="Card Number" />
              <div className="grid grid-cols-2 gap-3">
                <input className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="MM/YY" />
                <input className="bg-black/40 border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:ring-primary focus:border-primary" placeholder="CVV" />
              </div>
            </div>
            <button className="w-full mt-6 bg-primary hover:bg-primary/90 py-3 rounded-xl text-white font-semibold transition">
              Book Ticket
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
