
"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileWarning, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "@/hooks/use-toast";

interface Update {
    status: string;
    date: { seconds: number; nanoseconds: number; };
    comment: string;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  reportedAt: { seconds: number; nanoseconds: number; };
  updates: Update[];
  resolutionUrl?: string;
  resolutionHint?: string;
}

const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "In Progress":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "Reported":
      case "Acknowledged":
        return <FileWarning className="w-5 h-5 text-blue-600" />;
      default:
        return <FileWarning className="w-5 h-5 text-gray-500" />;
    }
}

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

export default function TrackingPage() {
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  // Hardcoding user for now, this should come from auth
  const userId = "anonymous_user"; 

  useEffect(() => {
    const q = query(
        collection(db, "issues"),
        where("reporterId", "==", userId),
        orderBy("reportedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const issuesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Issue));
      setUserIssues(issuesData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user issues:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your reported issues.' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);


  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-headline font-semibold">Track Your Reported Issues</h1>
        <p className="text-muted-foreground">Here you can see the status and updates on all issues you've reported.</p>
      </div>

      {loading ? (
         <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
         </div>
      ) : userIssues.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {userIssues.map((issue) => (
            <AccordionItem key={issue.id} value={issue.id} className="border-b-0">
                <div className="bg-card rounded-lg border shadow-sm">
                    <AccordionTrigger className="p-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                                {getStatusIcon(issue.status)}
                                <div>
                                    <p className="font-semibold text-left">{issue.title}</p>
                                    <p className="text-sm text-muted-foreground text-left">
                                    ID: {issue.id.substring(0, 6)}... • Reported on {new Date(issue.reportedAt.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={getStatusVariant(issue.status)}>{issue.status}</Badge>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                        <div className="border-t pt-4 space-y-6">
                            <div>
                                <h4 className="font-semibold mb-2">Timeline</h4>
                                <ol className="relative border-l border-border ml-2">                  
                                    {issue.updates.sort((a,b) => b.date.seconds - a.date.seconds).map((update, index) => (
                                        <li key={index} className="mb-6 ml-6">            
                                            <span className="absolute flex items-center justify-center w-6 h-6 bg-secondary rounded-full -left-3 ring-8 ring-background">
                                                {getStatusIcon(update.status)}
                                            </span>
                                            <div className="p-4 bg-muted/50 rounded-lg border">
                                                <h5 className="flex items-center mb-1 text-base font-semibold">{update.status}</h5>
                                                <time className="block mb-2 text-xs font-normal leading-none text-muted-foreground">{new Date(update.date.seconds * 1000).toLocaleString()}</time>
                                                <p className="text-sm font-normal">{update.comment}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            {issue.status === 'Resolved' && issue.resolutionUrl && (
                                <div>
                                    <h4 className="font-semibold mb-2">Resolution Photo</h4>
                                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg">
                                        <Image src={issue.resolutionUrl} data-ai-hint={issue.resolutionHint || "fixed issue"} alt={`Resolution for ${issue.title}`} layout="fill" objectFit="cover" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AccordionContent>
                </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">No issues reported yet.</h2>
            <p className="text-muted-foreground mt-2">Report an issue to start tracking its progress!</p>
        </div>
      )}
    </div>
  );
}
