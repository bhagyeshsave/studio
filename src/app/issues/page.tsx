
"use client"

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, MessageSquare, ListFilter, MapPin, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query, orderBy, where, doc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "@/hooks/use-toast";

interface Issue {
    id: string;
    title: string;
    status: string;
    location: string;
    reporter: string;
    reportedAt: {
        seconds: number;
        nanoseconds: number;
    };
    imageUrl: string;
    imageHint: string;
    upvotes: number;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "issues"), orderBy("reportedAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const issuesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
      setIssues(issuesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching issues:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch issues.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpvote = async (issueId: string) => {
    const issueRef = doc(db, "issues", issueId);
    try {
      await updateDoc(issueRef, {
        upvotes: increment(1)
      });
      toast({ title: 'Success', description: 'You have upvoted this issue.' });
    } catch (error) {
      console.error("Error upvoting issue:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not upvote the issue.' });
    }
  };


  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Resolved":
        return "default";
      case "In Progress":
        return "secondary";
      case "Reported":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className="lg:col-span-2 flex flex-col">
        <div className="flex-1 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
            <Image src="https://placehold.co/1200x800.png" alt="Map of issues" layout="fill" objectFit="cover" data-ai-hint="city map" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-background p-4 rounded-lg bg-black/50 backdrop-blur-sm">
                <h3 className="text-xl font-headline">Interactive Issues Map</h3>
                <p className="text-sm">Hover over pins to see issue details and validate.</p>
            </div>
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between pb-4">
          <h2 className="text-2xl font-headline font-semibold">Nearby Issues</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup value="newest">
                <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="closest">Closest</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value="all">
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="waste">Waste</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="roads">Roads</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card className="flex-1 flex flex-col">
          <ScrollArea className="h-full">
            <CardContent className="p-0">
              {loading ? (
                 <div className="flex items-center justify-center h-full p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                 </div>
              ) : (
                 <div className="divide-y">
                    {issues.map((issue) => (
                      <div key={issue.id} className="p-4 space-y-3 hover:bg-accent/50 transition-colors">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                            {issue.imageUrl && <Image src={issue.imageUrl} data-ai-hint={issue.imageHint} alt={issue.title} layout="fill" objectFit="cover" />}
                        </div>
                        <div className="flex items-start justify-between">
                            <h3 className="font-semibold font-headline">{issue.title}</h3>
                            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4"/> {issue.location}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>By {issue.reporter === 'anonymous' ? 'Anonymous' : issue.reporter}</span>
                            <span>{new Date(issue.reportedAt.seconds * 1000).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleUpvote(issue.id)}>
                                <ThumbsUp className="w-4 h-4"/> {issue.upvotes}
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2">
                                <MessageSquare className="w-4 h-4"/> Feedback
                            </Button>
                        </div>
                      </div>
                    ))}
                 </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
