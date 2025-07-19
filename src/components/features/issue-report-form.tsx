"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState, useRef, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Upload, FileVideo, Image as ImageIcon } from "lucide-react";
import { issueCategories } from "@/data/mock-data";
import { Wrapper } from "@googlemaps/react-wrapper";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select an issue category.",
  }),
  location: z.string().min(5, {
    message: "Please provide a location.",
  }),
  media: z.string().optional(), // Storing as data URI
});

const render = (status: "loading" | "failure" | "success") => {
    if (status === 'loading') return <div>Loading...</div>
    if (status === 'failure') return <div>Error loading maps</div>
    return null;
}

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});


function LocationInput({ field }: { field: any }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken>();

  useEffect(() => {
    if (!window.google || !inputRef.current) return;
    
    setSessionToken(new google.maps.places.AutocompleteSessionToken());

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry"],
        types: ["geocode"],
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
            field.onChange(place.formatted_address);
        }
    });

    return () => {
      // Clean up listeners
      if (window.google) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [field]);
  
  useEffect(() => {
    const getGeoLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                // For demonstration, we're not using the coords directly to set the input
                // but this is where you could reverse-geocode if needed.
                console.log("User's location:", position.coords);
            });
        }
    }
    getGeoLocation();
  }, [])


  return (
    <div className="relative">
      <Input
        {...field}
        ref={inputRef}
        placeholder="e.g., Corner of 1st Ave & Elm St"
        className="pr-10"
      />
       <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
            <MapPin className="h-5 w-5 text-muted-foreground" />
       </Button>
    </div>
  );
}


export function IssueReportForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      media: "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 5 * 1024 * 1024) { // 5MB limit
         toast({ variant: 'destructive', title: "File too large", description: "Please upload a file smaller than 5MB." });
         return;
      }
      try {
        const dataUri = await fileToDataUri(file);
        form.setValue("media", dataUri);
        setPreview(dataUri);
        setFileType(file.type);
      } catch (error) {
        toast({ variant: 'destructive', title: "Error reading file", description: "Could not process the selected file." });
      }
    }
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Issue Reported!",
      description: "Thank you for helping improve our community.",
    });
    form.reset();
    setPreview(null);
    setFileType(null);
  }

  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["places"]} render={render}>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Issue Title</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., Overflowing trash can on Main St." {...field} />
                </FormControl>
                <FormDescription>
                    A short, clear title for the issue.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="Provide details about the issue, its location, and any other relevant information."
                    className="resize-y min-h-[120px]"
                    {...field}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an issue category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {issueCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <LocationInput field={field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Photo/Video</FormLabel>
                    <FormControl>
                        <div className="relative flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-accent/50 transition-colors">
                                {preview ? (
                                    <div className="relative w-full h-full">
                                        {fileType?.startsWith('image/') && <Image src={preview} layout="fill" objectFit="contain" alt="Preview" />}
                                        {fileType?.startsWith('video/') && <video src={preview} className="w-full h-full object-contain" controls />}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs text-muted-foreground">PNG, JPG, MP4 (MAX. 5MB)</p>
                                    </div>
                                )}
                                <Input id="dropzone-file" type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                            </label>
                        </div> 
                    </FormControl>
                    <FormDescription>
                        Adding a photo or video can help resolve the issue faster.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <Button type="submit" size="lg">Submit Report</Button>
        </form>
        </Form>
    </Wrapper>
  );
}
