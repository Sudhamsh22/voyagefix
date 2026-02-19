"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, MapPin, Users, Wallet, Landmark, UtensilsCrossed, Mountain, Sprout, Martini, ShoppingBag, Plane, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { type AIGeneratedItineraryOutput, aiGeneratedItinerary } from "@/ai/flows/ai-generated-itinerary";

const interests = [
    { id: "culture", label: "Culture", icon: Landmark },
    { id: "food", label: "Food", icon: UtensilsCrossed },
    { id: "adventure", label: "Adventure", icon: Mountain },
    { id: "relaxation", label: "Relaxation", icon: Sprout },
    { id: "nightlife", label: "Nightlife", icon: Martini },
    { id: "shopping", label: "Shopping", icon: ShoppingBag },
] as const;

const formSchema = z.object({
  destination: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  dates: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date().optional(),
  }).optional(),
  budget: z.enum(['budget-friendly', 'moderate', 'luxury']),
  travelers: z.coerce.number().int().min(1, {message: 'Must have at least 1 traveler.'}),
  interests: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one interest.",
  }),
});

type PlannerFormProps = {
  onItineraryGenerated: (data: AIGeneratedItineraryOutput | null, isLoading: boolean, error: string | null) => void;
  isLoading: boolean;
};

export default function PlannerForm({ onItineraryGenerated, isLoading }: PlannerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      budget: "moderate",
      travelers: 1,
      interests: ["culture"],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.dates?.from || !values.dates?.to) {
        form.setError("dates", { message: "A complete date range is required." });
        return;
    }
    if (values.dates.to < values.dates.from) {
        form.setError("dates", { message: "End date must be on or after start date." });
        return;
    }
    
    onItineraryGenerated(null, true, null);
    try {
        const result = await aiGeneratedItinerary({
            ...values,
            destination: values.destination,
            budget: values.budget,
            travelers: values.travelers,
            interests: values.interests,
            startDate: format(values.dates.from, 'yyyy-MM-dd'),
            endDate: format(values.dates.to, 'yyyy-MM-dd'),
        });
        onItineraryGenerated(result, false, null);
    } catch (e) {
        console.error(e);
        onItineraryGenerated(null, false, "Failed to generate itinerary. The AI model might be unavailable. Please try again.");
    }
  }

  return (
    <div className="sticky top-24 bg-card/50 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10 overflow-hidden">
      <div className="p-6 bg-black/20">
         <h2 className="font-headline text-2xl text-center">Your Travel Ticket</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
            <div className="p-6 space-y-6 flex-1">
                <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-muted-foreground"><MapPin className="h-4 w-4"/> Destination</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Paris, France" {...field} disabled={isLoading}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2 font-semibold text-muted-foreground"><CalendarIcon className="h-4 w-4" /> Travel Dates</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value?.from && "text-muted-foreground"
                            )}
                            disabled={isLoading}
                            >
                            {field.value?.from ? (
                                field.value.to ? (
                                <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                </>
                                ) : (
                                format(field.value.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date range</span>
                            )}
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={field.value}
                            onSelect={field.onChange}
                            numberOfMonths={1}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-muted-foreground"><Users className="h-4 w-4" /> Travelers</FormLabel>
                        <FormControl>
                            <Input type="number" min="1" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold text-muted-foreground"><Wallet className="h-4 w-4" /> Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="budget-friendly">Budget</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                
                <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-semibold text-muted-foreground">Interests</FormLabel>
                         <FormControl>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                {interests.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            const newInterests = field.value.includes(item.id)
                                                ? field.value.filter((i) => i !== item.id)
                                                : [...field.value, item.id];
                                            field.onChange(newInterests);
                                        }}
                                        className={cn(
                                            "flex items-center justify-center gap-2 p-2 rounded-md text-sm border transition-colors disabled:opacity-50",
                                            field.value.includes(item.id)
                                                ? "bg-primary/20 border-primary text-primary-foreground"
                                                : "bg-background/50 border-input hover:bg-accent"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />


                <Button type="submit" className="w-full !mt-8 group" size="lg" disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isLoading ? 'Generating...' : 'Generate Itinerary'}
                    <ArrowRight className="ml-auto h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Button>
            </div>
            <div className="w-2 bg-transparent" style={{
                borderLeft: '2px dashed hsl(var(--border))'
            }}></div>
            <div className="w-24 bg-black/20 flex flex-col items-center justify-center p-2">
                <Plane className="transform -rotate-90 text-muted-foreground" />
                <p className="text-xs text-muted-foreground/50 writing-mode-vertical-rl text-center mt-4 tracking-widest">VOYAGEFLIX</p>
            </div>
        </form>
      </Form>
    </div>
  );
}
