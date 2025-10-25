import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Trophy, Camera } from 'lucide-react';
import { SMILE_REWARD_THRESHOLD } from '@shared/schema';

interface SmileScoreProps {
  score: number | null;
  isAnalyzing?: boolean;
}

export function SmileScore({ score, isAnalyzing = false }: SmileScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (score !== null && score > 0) {
      const duration = 1000;
      const steps = 50;
      const increment = score / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayScore(0);
    }
  }, [score]);

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return <Smile className="h-16 w-16 text-primary" />;
    if (score >= 50) return <Meh className="h-16 w-16 text-accent-foreground" />;
    return <Frown className="h-16 w-16 text-muted-foreground" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Amazing Smile!';
    if (score >= 80) return 'Great Smile!';
    if (score >= 60) return 'Good Smile';
    if (score >= 40) return 'Nice Try';
    return 'Keep Smiling!';
  };

  const getScoreColor = (score: number) => {
    if (score >= SMILE_REWARD_THRESHOLD) return 'text-primary';
    if (score >= 50) return 'text-accent-foreground';
    return 'text-muted-foreground';
  };

  if (isAnalyzing) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Smile className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h3 className="text-2xl font-display font-semibold">Analyzing Your Smile...</h3>
          <p className="text-muted-foreground">Our AI is scoring your smile</p>
          <Progress value={undefined} className="w-full" />
        </div>
      </Card>
    );
  }

  if (score === null) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Camera className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-display font-semibold">Ready to Smile?</h3>
          <p className="text-muted-foreground">
            Capture your best smile to earn rewards
          </p>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            Score {SMILE_REWARD_THRESHOLD}+ to earn tokens
          </Badge>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8" data-testid="card-smile-score">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          {getScoreEmoji(displayScore)}
        </div>

        <div className="space-y-2">
          <div className={`text-7xl font-display font-bold ${getScoreColor(displayScore)}`} data-testid="text-score">
            {displayScore}
          </div>
          <div className="text-xl text-muted-foreground">/ 100</div>
        </div>

        <h3 className="text-2xl font-display font-semibold">{getScoreLabel(displayScore)}</h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Smile Quality</span>
            <span className="font-medium">{displayScore}%</span>
          </div>
          <Progress value={displayScore} className="h-3" data-testid="progress-score" />
        </div>

        {displayScore >= SMILE_REWARD_THRESHOLD && (
          <Badge variant="default" className="gap-2 text-base px-4 py-2">
            <Trophy className="h-4 w-4" />
            Reward Eligible!
          </Badge>
        )}

        {displayScore < SMILE_REWARD_THRESHOLD && (
          <p className="text-sm text-muted-foreground">
            Score {SMILE_REWARD_THRESHOLD}+ to earn token rewards
          </p>
        )}
      </div>
    </Card>
  );
}
