import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CameraCapture } from '@/components/CameraCapture';
import { SmileScore } from '@/components/SmileScore';
import { DonationPanel } from '@/components/DonationPanel';
import { Leaderboard } from '@/components/Leaderboard';
import { StatsPanel } from '@/components/StatsPanel';
import { WalletConnect } from '@/components/WalletConnect';
import { DeploymentNotice } from '@/components/DeploymentNotice';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Coins } from 'lucide-react';
import {
  submitSmileScore,
  donateToPool,
  getLeaderboard,
  getDonationPoolSize,
  getUserInfo,
} from '@/lib/contract';
import { analyzeSmile, preloadModel } from '@/lib/smileDetection';
import { SMILE_REWARD_THRESHOLD } from '@shared/schema';

export default function Home() {
  const { wallet } = useWeb3();
  const { toast } = useToast();
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Fetch leaderboard data
  const { data: leaderboard = [], refetch: refetchLeaderboard } = useQuery({
    queryKey: ['/leaderboard'],
    queryFn: getLeaderboard,
    enabled: wallet.connected,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
  
  // Fetch donation pool size
  const { data: poolSize = '0', refetch: refetchPool } = useQuery({
    queryKey: ['/pool'],
    queryFn: getDonationPoolSize,
    enabled: wallet.connected,
    refetchInterval: 10000,
  });
  
  // Fetch user stats
  const { data: userInfo } = useQuery({
    queryKey: ['/user', wallet.address],
    queryFn: () => getUserInfo(wallet.address!),
    enabled: wallet.connected && !!wallet.address,
    refetchInterval: 10000,
  });
  
  const stats = {
    totalSmiles: 0, // Not tracked in contract
    averageScore: 0, // Not tracked in contract
    tokensEarned: userInfo?.totalRewards || '0',
    bestScore: userInfo?.bestScore || 0,
  };

  // Preload TensorFlow.js model on component mount
  useEffect(() => {
    preloadModel();
  }, []);

  const handleCapture = async (imageSrc: string) => {
    if (!wallet.connected || !wallet.address) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
      });
      return;
    }

    setIsAnalyzing(true);
    setCurrentScore(null);

    try {
      // Analyze smile using TensorFlow.js
      const smileScore = await analyzeSmile(imageSrc);
      setCurrentScore(smileScore);

      // Submit score to smart contract
      try {
        const txHash = await submitSmileScore(wallet.address, smileScore);
        
        if (smileScore >= SMILE_REWARD_THRESHOLD) {
          toast({
            title: 'Congratulations! 🎉',
            description: `Your smile scored ${smileScore}! Reward claimed automatically.`,
          });
        } else {
          toast({
            title: 'Smile Recorded!',
            description: `Your smile scored ${smileScore}. Score ${SMILE_REWARD_THRESHOLD}+ to earn rewards!`,
          });
        }
        
        // Refresh data
        refetchLeaderboard();
        refetchPool();
      } catch (contractError: any) {
        toast({
          variant: 'destructive',
          title: 'Blockchain Error',
          description: contractError.message || 'Failed to submit score to contract',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error.message || 'Failed to analyze your smile. Please try again.',
      });
      setCurrentScore(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDonate = async (amount: string) => {
    if (!wallet.connected || !wallet.address) {
      throw new Error('Wallet not connected');
    }

    const txHash = await donateToPool(wallet.address, amount);
    
    // Refresh pool data
    refetchPool();
    refetchLeaderboard();
    
    return txHash;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-2xl font-display font-bold">
                <Sparkles className="h-7 w-7 text-primary" />
                <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                  SmileChain
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Coins className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-primary">Celo Alfajores</span>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold bg-gradient-to-r from-primary via-accent-foreground to-primary bg-clip-text text-transparent">
            Earn Tokens with Your Smile
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Capture your best smile, get scored by AI, and earn Celo tokens. The happier you look, the more you earn!
          </p>
        </div>

        {/* Deployment Notice */}
        <DeploymentNotice />

        {/* Stats Overview */}
        {wallet.connected && (
          <div className="mb-8">
            <StatsPanel {...stats} />
          </div>
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Camera & Score */}
          <div className="space-y-6">
            <CameraCapture onCapture={handleCapture} isProcessing={isAnalyzing} />
            <SmileScore score={currentScore} isAnalyzing={isAnalyzing} />
          </div>

          {/* Right Column - Donation & Leaderboard */}
          <div className="space-y-6">
            <DonationPanel poolSize={poolSize} onDonate={handleDonate} />
            <Leaderboard entries={leaderboard} />
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Capture Your Smile',
                description: 'Use your camera to take a selfie showing your best smile',
              },
              {
                step: '2',
                title: 'AI Scores Your Smile',
                description: 'Our on-device AI model analyzes and rates your smile from 0-100',
              },
              {
                step: '3',
                title: 'Earn Rewards',
                description: 'Score 80+ to automatically receive Celo tokens as a reward',
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-display font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>SmileChain is a decentralized application built on Celo Alfajores testnet</p>
          <p className="mt-2">All smile detection happens on your device. Your photos are never uploaded.</p>
        </div>
      </footer>
    </div>
  );
}
