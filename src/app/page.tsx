
"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ShieldCheck, Siren, Trash2, Droplets, Construction, Loader2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "@/hooks/use-toast";
import { communityData } from "@/data/mock-data"; // Keep campaigns for now

interface Ward {
  name: string;
  wardNumber: number;
  hygieneRating: number;
  safetyRating: number;
  issuesResolved: number;
  openIssues: number;
}

interface IssueStats {
    waste: number;
    water: number;
    roads: number;
}

export default function Dashboard() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [issueStats, setIssueStats] = useState<IssueStats>({ waste: 0, water: 0, roads: 0});
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Wards
    const fetchWards = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "wards"));
        const wardsData = querySnapshot.docs.map(doc => doc.data() as Ward);
        setWards(wardsData);
        if (querySnapshot.empty) {
            setFirebaseError("Connected to Firebase, but 'wards' collection is empty or does not exist.");
        } else {
            setFirebaseError(null);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast({ variant: "destructive", title: "Firebase Connection Error", description: "Could not fetch ward data. Check your Firebase setup and permissions." });
        setFirebaseError("Failed to connect to Firebase. Please check your configuration and security rules.");
      }
    };

    // Fetch and listen to Issues for stats
    const q = query(collection(db, "issues"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const stats: IssueStats = { waste: 0, water: 0, roads: 0 };
        querySnapshot.forEach((doc) => {
            const issue = doc.data();
            switch (issue.category) {
                case "Waste Management":
                    stats.waste++;
                    break;
                case "Water & Sewage":
                    stats.water++;
                    break;
                case "Roads & Infrastructure":
                    stats.roads++;
                    break;
            }
        });
        setIssueStats(stats);
    }, (error) => {
        console.error("Error fetching issue stats:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch issue statistics." });
        // Don't set the main firebaseError here, as the wards check is the primary test
    });

    const loadData = async () => {
        setLoading(true);
        await fetchWards();
        setLoading(false);
    }

    loadData();

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
            <Loader2 className="w-10 h-10 animate-spin text-primary"/>
        </div>
    )
  }

  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
            <CardTitle>Firebase Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
            {firebaseError ? (
                <div className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-5 h-5"/>
                    <p>{firebaseError}</p>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5"/>
                    <p>Successfully connected to Firebase and fetched data.</p>
                </div>
            )}
        </CardContent>
       </Card>

      <section>
        <h2 className="text-3xl font-headline font-semibold tracking-tight mb-4">Community Scorecard</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wards.map((ward) => (
            <Card key={ward.name} className="flex flex-col">
              <CardHeader>
                <CardTitle>{ward.name}</CardTitle>
                <CardDescription>Ward No. {ward.wardNumber}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium">Hygiene Rating</p>
                    <span className="font-bold text-lg text-primary">{ward.hygieneRating}/5</span>
                  </div>
                  <Progress value={ward.hygieneRating * 20} aria-label={`${ward.hygieneRating} out of 5 for hygiene`} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-medium">Safety Rating</p>
                    <span className="font-bold text-lg text-primary">{ward.safetyRating}/5</span>
                  </div>
                  <Progress value={ward.safetyRating * 20} aria-label={`${ward.safetyRating} out of 5 for safety`} />
                </div>
                <div className="flex items-center pt-2">
                  <ShieldCheck className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-muted-foreground">{ward.issuesResolved} issues resolved this month</p>
                </div>
                <div className="flex items-center">
                  <Siren className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-sm text-muted-foreground">{ward.openIssues} open issues</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold tracking-tight mb-4">Recent Issues</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Waste Management</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{issueStats.waste}</div>
              <p className="text-xs text-muted-foreground">new reports this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Supply</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{issueStats.water}</div>
              <p className="text-xs text-muted-foreground">leakages reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Road Maintenance</CardTitle>
              <Construction className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{issueStats.roads}</div>
              <p className="text-xs text-muted-foreground">pothole reports</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-headline font-semibold tracking-tight">Local Campaigns</h2>
          <Button variant="ghost" asChild>
            <Link href="#">View All <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {communityData.campaigns.map((campaign) => (
            <Card key={campaign.title} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={campaign.imageUrl} alt={campaign.title} layout="fill" objectFit="cover" data-ai-hint={campaign.imageHint} />
              </div>
              <CardHeader>
                <CardTitle>{campaign.title}</CardTitle>
                <CardDescription className="flex items-center pt-1">
                  <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>{campaign.status}</Badge>
                  <span className="mx-2">•</span>
                  <span>{campaign.date}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
                <Button className="mt-4">Join Campaign</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
