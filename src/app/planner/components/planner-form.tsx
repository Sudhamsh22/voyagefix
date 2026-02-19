"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles, Landmark, UtensilsCrossed, Mountain, Sprout, Martini, ShoppingBag, ArrowRight } from "lucide-react";
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
    from: z.date().optional(),
    to: z.date().optional(),
  }),
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

const FormRow = ({ label, code, children }: { label: string, code: string, children: React.ReactNode }) => (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-4">
        <div className="flex flex-col items-start">
            <span className="text-xs font-mono text-muted-foreground">{code}</span>
            <span className="font-semibold text-foreground">{label}</span>
        </div>
        <div className="w-1/2">{children}</div>
    </div>
);

export default function PlannerForm({ onItineraryGenerated, isLoading }: PlannerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      dates: { from: undefined, to: undefined },
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

  const inputStyles = "bg-background/50 border-input/50 focus:bg-background/80 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-offset-background";

  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-xl shadow-2xl border border-white/10">
      <div className="p-4 border-b border-white/10">
         <h2 className="font-headline text-lg text-center text-foreground">Flight Configuration</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <div className="space-y-2">
                 <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                    <FormItem>
                        <FormRow label="Destination" code="LOC">
                            <FormControl>
                                <Input placeholder="e.g., Bali" {...field} disabled={isLoading} className={inputStyles}/>
                            </FormControl>
                        </FormRow>
                        <FormMessage className="text-right w-full mt-1 pr-1" />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                    <FormItem>
                        <FormRow label="Departure Dates" code="DEP">
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", inputStyles, !field.value?.from && "text-muted-foreground" )}
                                    disabled={isLoading}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value?.from ? (
                                        field.value.to ? (
                                        <>
                                            {format(field.value.from, "LLL d, y")} -{" "}
                                            {format(field.value.to, "LLL d, y")}
                                        </>
                                        ) : (
                                        format(field.value.from, "LLL d, y")
                                        )
                                    ) : (
                                        <span>Select date range</span>
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
                        </FormRow>
                        <FormMessage className="text-right w-full mt-1 pr-1" />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="travelers"
                    render={({ field }) => (
                        <FormItem>
                            <FormRow label="Passengers" code="PAX">
                                <FormControl>
                                    <Input type="number" min="1" {...field} disabled={isLoading} className={cn(inputStyles, "text-center font-mono")} />
                                </FormControl>
                            </FormRow>
                            <FormMessage className="text-right w-full mt-1 pr-1" />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                        <FormItem>
                            <FormRow label="Fare Class" code="FARE">
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                    <FormControl>
                                    <SelectTrigger className={inputStyles}>
                                        <SelectValue placeholder="Select..." />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="budget-friendly">Economy</SelectItem>
                                        <SelectItem value="moderate">Business</SelectItem>
                                        <SelectItem value="luxury">First Class</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormRow>
                            <FormMessage className="text-right w-full mt-1 pr-1" />
                        </FormItem>
                    )}
                />
                
                <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                    <FormItem>
                         <FormRow label="Trip Type" code="TYPE">
                            <div className="grid grid-cols-2 gap-2">
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
                                                : "bg-background/50 border-input/50 hover:bg-accent"
                                        )}
                                        disabled={isLoading}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </FormRow>
                        <FormMessage className="text-right w-full mt-1 pr-1" />
                    </FormItem>
                )}
                />
            </div>

            <Button type="submit" className="w-full !mt-8 group" size="lg" disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'GENERATING...' : 'GENERATE ROUTE'}
                <ArrowRight className="ml-auto h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
        </form>
      </Form>
    </div>
  );
}
