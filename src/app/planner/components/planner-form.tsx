"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { type AIGeneratedItineraryOutput, aiGeneratedItinerary } from "@/ai/flows/ai-generated-itinerary";
import { Checkbox } from "@/components/ui/checkbox";

const interests = [
    { id: "culture", label: "Culture & History" },
    { id: "food", label: "Food & Culinary" },
    { id: "adventure", label: "Adventure & Outdoors" },
    { id: "relaxation", label: "Relaxation & Wellness" },
    { id: "nightlife", label: "Nightlife & Entertainment" },
    { id: "shopping", label: "Shopping" },
] as const;

const formSchema = z.object({
  destination: z.string().min(2, { message: "Destination must be at least 2 characters." }),
  dates: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date({ required_error: "An end date is required." }),
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
    onItineraryGenerated(null, true, null);
    try {
        const result = await aiGeneratedItinerary({
            ...values,
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
    <Card className="sticky top-24 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline">Trip Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
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
                  <FormLabel>Travel Dates</FormLabel>
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
                          <CalendarIcon className="mr-2 h-4 w-4" />
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
                        selected={{ from: field.value?.from, to: field.value?.to }}
                        onSelect={(range) => field.onChange(range)}
                        numberOfMonths={1}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="budget-friendly">Budget-Friendly</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Travelers</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>Interests</FormLabel>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {interests.map((item) => (
                        <FormField
                        key={item.id}
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                            return (
                            <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                            >
                                <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                    return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                            (value) => value !== item.id
                                            )
                                        )
                                    }}
                                    disabled={isLoading}
                                />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                {item.label}
                                </FormLabel>
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


            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isLoading ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
