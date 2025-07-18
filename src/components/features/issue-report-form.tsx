"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { MapPin, Upload } from "lucide-react";
import { issueCategories } from "@/data/mock-data";

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
  media: z.any().optional(),
});

export function IssueReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Issue Reported!",
      description: "Thank you for helping improve our community.",
    });
    form.reset();
  }

  return (
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
                    <div className="relative">
                        <Input placeholder="e.g., Corner of 1st Ave & Elm St" {...field} className="pr-10" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
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
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or MP4 (MAX. 800x400px)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" {...field} />
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
  );
}
