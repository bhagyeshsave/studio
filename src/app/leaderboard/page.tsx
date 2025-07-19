
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Medal, Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "@/hooks/use-toast";

interface User {
    rank: number;
    user: string;
    points: number;
    avatar: string;
    badges: string[];
}

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("points", "desc"));
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          rank: index + 1,
          ...doc.data()
        } as unknown as User));
        setLeaderboardData(users);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch leaderboard data.' });
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Community Leaderboard</CardTitle>
          <CardDescription>
            Earn points for reporting and validating issues. See who's making the biggest impact!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
             </div>
          ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {leaderboardData.map((user) => (
                    <TableRow key={user.rank}>
                    <TableCell>
                        <div className="flex items-center justify-center">
                            {getRankIcon(user.rank)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={user.avatar} alt={user.user} data-ai-hint="user avatar" />
                            <AvatarFallback>{user.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.user}</span>
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 flex-wrap">
                        {user.badges && user.badges.map((badge) => (
                            <Badge key={badge} variant="secondary">
                            {badge}
                            </Badge>
                        ))}
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-lg text-primary">{user.points}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
