"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateVlog, type GenerateVlogOutput } from "@/ai/flows/automated-vlog-generation";
import { Loader2, Wand2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  trendingTopics: z.string().min(5, {
    message: "Topics must be at least 5 characters.",
  }),
});

export function VlogGeneratorClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [vlogData, setVlogData] = useState<GenerateVlogOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      trendingTopics: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setVlogData(null);
    setError(null);

    try {
      const result = await generateVlog(values);
      setVlogData(result);
    } catch (err) {
      setError("Failed to generate vlog. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Generate Area Vlog</CardTitle>
          <CardDescription>
            Create an automated visual summary for any location.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown, Central Park" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trendingTopics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trending Topics or Keywords</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Street art, food trucks, weekend market"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Help the AI understand what to focus on.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Vlog
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="sticky top-20">
        <Card>
          <CardHeader>
            <CardTitle>Generated Vlog</CardTitle>
            <CardDescription>Your AI-generated content will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {vlogData && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src={vlogData.visualSummaryImage} alt={vlogData.vlogTitle} layout="fill" objectFit="cover" />
                </div>
                <h3 className="text-xl font-headline font-semibold">{vlogData.vlogTitle}</h3>
                <p className="text-sm text-muted-foreground">{vlogData.vlogDescription}</p>
                <audio controls src={vlogData.narrationAudio} className="w-full">
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
