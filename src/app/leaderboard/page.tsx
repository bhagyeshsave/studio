import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { leaderboardData } from "@/data/mock-data";
import { Crown, Medal, Award } from "lucide-react";

const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-700" />;
    return <span className="text-muted-foreground font-medium">{rank}</span>;
}

export default function LeaderboardPage() {
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
                <TableRow key={user.rank} className={user.user === "You" ? "bg-accent/50" : ""}>
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
                      {user.badges.map((badge) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
