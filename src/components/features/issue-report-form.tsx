
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
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
import { MapPin, Upload, Loader2 } from "lucide-react";
import { issueCategories } from "@/data/mock-data";
import Image from "next/image";
import { db, storage } from "@/lib/firebase/config";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';


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
  media: z.instanceof(File).optional(),
});


export function IssueReportForm() {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      media: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if(file.size > 25 * 1024 * 1024) { // 25MB limit
         toast({ variant: 'destructive', title: "File too large", description: "Please upload a file smaller than 25MB." });
         return;
      }
      form.setValue("media", file);
      setPreview(URL.createObjectURL(file));
      setFileType(file.type);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    let issueDocRef;

    const issueData = {
        title: values.title,
        description: values.description,
        category: values.category,
        location: values.location,
        imageUrl: "",
        status: "Reported",
        reporterId: "anonymous_user",
        reporter: "Anonymous",
        reportedAt: serverTimestamp(),
        upvotes: 0,
        updates: [
          {
            status: "Reported",
            date: new Date(),
            comment: "Issue submitted by user."
          }
        ]
    };

    try {
      console.log("Attempting to submit the following data to Firestore:", issueData);

      issueDocRef = await addDoc(collection(db, "issues"), issueData);
      
      console.log("Document successfully created with ID:", issueDocRef.id);

      toast({
        title: "Issue Reported!",
        description: "Thank you for your submission. Your media is uploading in the background if attached.",
      });

      // Reset form and UI state immediately
      form.reset();
      setPreview(null);
      setFileType(null);

    } catch (error) {
      console.error("Error creating Firestore document:", error);
      toast({ 
        variant: 'destructive', 
        title: "Submission Failed", 
        description: "Could not submit your issue. Please check your Firebase project configuration and ensure the Firestore API is enabled." 
      });
      setIsSubmitting(false);
      return;
    } finally {
        setIsSubmitting(false);
    }

    // Handle media upload in the background
    const mediaFile = values.media;
    if (mediaFile && issueDocRef) {
      try {
        console.log("Starting background media upload...");
        const storageRef = ref(storage, `issues/${issueDocRef.id}/${uuidv4()}`);
        const uploadResult = await uploadBytes(storageRef, mediaFile);
        const mediaUrl = await getDownloadURL(uploadResult.ref);

        await updateDoc(doc(db, "issues", issueDocRef.id), {
            imageUrl: mediaUrl
        });
        console.log("Background media upload and document update complete.");
      } catch (uploadError) {
        console.error("Background media upload failed:", uploadError);
        toast({
          variant: 'destructive',
          title: "Media Upload Failed",
          description: "Your issue was reported, but the attached media failed to upload."
        });
      }
    }
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
                        <Input
                            placeholder="e.g., Corner of 1st Ave & Elm St"
                            {...field}
                            className="pr-10"
                        />
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                            {preview ? (
                                <div className="relative w-full h-full">
                                    {fileType?.startsWith('image/') && <Image src={preview} layout="fill" objectFit="contain" alt="Preview" />}
                                    {fileType?.startsWith('video/') && <video src={preview} className="w-full h-full object-contain" controls />}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, MP4 (MAX. 25MB)</p>
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
        <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
        </Button>
    </form>
    </Form>
  );
}
