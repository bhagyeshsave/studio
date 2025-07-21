
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Medal, Award, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { leaderboardData as mockLeaderboard, User } from "@/data/mock-data";


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
    // Simulate fetching data
    setTimeout(() => {
        setLeaderboardData(mockLeaderboard);
        setLoading(false);
    }, 500);
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
