import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ShieldCheck, Siren, Trash2, Droplets, Construction } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { communityData } from "@/data/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-3xl font-headline font-semibold tracking-tight mb-4">Community Scorecard</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communityData.wards.map((ward) => (
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
              <div className="text-2xl font-bold">+23</div>
              <p className="text-xs text-muted-foreground">new reports this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Supply</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+8</div>
              <p className="text-xs text-muted-foreground">leakages reported</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Road Maintenance</CardTitle>
              <Construction className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
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
