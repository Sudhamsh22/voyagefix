"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Landmark, UtensilsCrossed, Mountain, Sprout, Martini, ShoppingBag } from "lucide-react";
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
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Use YYYY-MM-DD format."}),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {message: "Use YYYY-MM-DD format."}),
  budget: z.enum(['budget-friendly', 'moderate', 'luxury']),
  travelers: z.coerce.number().int().min(1, {message: 'Must have at least 1 traveler.'}),
  interests: z.array(z.string()).refine(value => value.some(item => item), {
    message: "You have to select at least one interest.",
  }),
}).refine(data => {
    try {
        return new Date(data.endDate) >= new Date(data.startDate);
    } catch {
        return false;
    }
}, {
    message: "End date must be on or after start date.",
    path: ["endDate"],
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
      startDate: "",
      endDate: "",
      budget: "moderate",
      travelers: 1,
      interests: ["culture"],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    onItineraryGenerated(null, true, null);
    try {
        const result = await aiGeneratedItinerary(values);
        onItineraryGenerated(result, false, null);
    } catch (e) {
        console.error(e);
        onItineraryGenerated(null, false, "Failed to generate itinerary. The AI model might be unavailable. Please try again.");
    }
  }

  const inputStyles = "w-full mt-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus-visible:ring-primary";
  const labelStyles = "text-gray-400 text-sm";

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      <h3 className="text-white font-semibold text-lg text-center mb-6">
        Flight Configuration
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelStyles}>Destination</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bali, Indonesia" {...field} disabled={isLoading} className={inputStyles}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyles}>Start Date</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY-MM-DD" {...field} disabled={isLoading} className={inputStyles}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelStyles}>End Date</FormLabel>
                    <FormControl>
                      <Input placeholder="YYYY-MM-DD" {...field} disabled={isLoading} className={inputStyles}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelStyles}>Passengers</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} disabled={isLoading} className={inputStyles} />
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
                  <FormLabel className={labelStyles}>Fare Class</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel className={labelStyles}>Trip Type</FormLabel>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                      {interests.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem key={item.id} className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                   <button
                                        type="button"
                                        onClick={() => {
                                            const newInterests = field.value.includes(item.id)
                                                ? field.value.filter((i) => i !== item.id)
                                                : [...field.value, item.id];
                                            field.onChange(newInterests);
                                        }}
                                        className={
                                            "w-full flex items-center justify-center gap-2 p-2 rounded-md text-sm border transition-colors disabled:opacity-50 " +
                                            (field.value.includes(item.id)
                                                ? "bg-primary/20 border-primary text-primary-foreground"
                                                : "bg-black/40 border-white/20 hover:bg-white/10 text-white")
                                        }
                                        disabled={isLoading}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </button>
                                </FormControl>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full !mt-8 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-primary/30 transition" size="lg" disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? 'GENERATING...' : 'GENERATE ROUTE'}
            </Button>
        </form>
      </Form>
    </div>
  );
}
