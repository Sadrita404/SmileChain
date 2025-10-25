import { Card, CardContent } from '@/components/ui/card';
import { Smile, Coins, TrendingUp, Trophy } from 'lucide-react';

interface StatsPanelProps {
  totalSmiles: number;
  averageScore: number;
  tokensEarned: string;
  bestScore: number;
}

export function StatsPanel({ totalSmiles, averageScore, tokensEarned, bestScore }: StatsPanelProps) {
  const stats = [
    {
      label: 'Total Smiles',
      value: totalSmiles,
      icon: Smile,
      color: 'text-primary',
    },
    {
      label: 'Average Score',
      value: averageScore.toFixed(0),
      icon: TrendingUp,
      color: 'text-accent-foreground',
    },
    {
      label: 'Tokens Earned',
      value: parseFloat(tokensEarned).toFixed(2),
      suffix: 'CELO',
      icon: Coins,
      color: 'text-chart-2',
    },
    {
      label: 'Best Score',
      value: bestScore,
      icon: Trophy,
      color: 'text-chart-1',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold" data-testid={`stat-${stat.label.toLowerCase().replace(' ', '-')}`}>
                  {stat.value}
                  {stat.suffix && <span className="text-sm ml-1 text-muted-foreground">{stat.suffix}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
