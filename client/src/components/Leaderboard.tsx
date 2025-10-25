import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Coins } from 'lucide-react';
import { LeaderboardEntry } from '@shared/schema';
import { useWeb3 } from '@/contexts/Web3Context';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function Leaderboard({ entries, isLoading = false }: LeaderboardProps) {
  const { wallet } = useWeb3();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-semibold text-sm">#{rank}</span>;
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isCurrentUser = (address: string) => {
    return wallet.address?.toLowerCase() === address.toLowerCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
          <CardDescription>Top smile scorers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top {entries.length} smile scorers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <Trophy className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No scores yet</p>
            <p className="text-xs text-muted-foreground">
              Be the first to earn a spot on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.address}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrentUser(entry.address)
                    ? 'bg-primary/10 border border-primary/20'
                    : 'bg-card hover-elevate'
                }`}
                data-testid={`leaderboard-entry-${entry.rank}`}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm truncate">
                      {formatAddress(entry.address)}
                    </span>
                    {isCurrentUser(entry.address) && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Score: <span className="font-semibold text-foreground">{entry.score}</span>
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {parseFloat(entry.tokensEarned).toFixed(2)} CELO
                    </span>
                  </div>
                </div>

                <Badge variant="secondary" className="font-display text-lg px-3 py-1">
                  {entry.score}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
