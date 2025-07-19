
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
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
import { Loader2, Wand2, Film } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      trendingTopics: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setVlogData(null);
    setError(null);
    setProgress(10);

    try {
      const result = await generateVlog(values);
      setProgress(100);
      setVlogData(result);
    } catch (err) {
      setError("Failed to generate vlog. This can take a minute, please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (video && audio && vlogData) {
      const playAudio = () => audio.play();
      const pauseAudio = () => audio.pause();
      const resetAudio = () => {
        audio.pause();
        audio.currentTime = 0;
      }
      
      video.addEventListener('play', playAudio);
      video.addEventListener('pause', pauseAudio);
      video.addEventListener('ended', resetAudio);
      video.addEventListener('seeked', () => {
        audio.currentTime = video.currentTime;
      })

      return () => {
        video.removeEventListener('play', playAudio);
        video.removeEventListener('pause', pauseAudio);
        video.removeEventListener('ended', resetAudio);
        video.removeEventListener('seeked', () => {
           audio.currentTime = video.currentTime;
        });
      };
    }
  }, [vlogData]);


  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Generate Area Vlog</CardTitle>
          <CardDescription>
            Create an automated video summary for any location.
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
                    Generating Video...
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
            <CardDescription>Your AI-generated video will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                 <div className="flex flex-col items-center justify-center bg-muted aspect-video rounded-lg p-8">
                    <Progress value={progress} className="w-full" />
                    <p className="text-muted-foreground mt-4 text-center">Generating video, this may take a moment...</p>
                </div>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {vlogData && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                  <video ref={videoRef} src={vlogData.vlogVideo} controls loop className="w-full h-full">
                    Your browser does not support the video tag.
                  </video>
                  <audio ref={audioRef} src={vlogData.vlogAudio} className="hidden" />
                </div>
                <h3 className="text-xl font-headline font-semibold">{vlogData.vlogTitle}</h3>
                <p className="text-sm text-muted-foreground">{vlogData.vlogDescription}</p>
              </div>
            )}
             {!isLoading && !vlogData && !error && (
              <div className="flex flex-col items-center justify-center bg-muted aspect-video rounded-lg">
                <Film className="w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground mt-2">Your generated video will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
