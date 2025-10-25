import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Coins } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { donationSchema, type DonationInput } from '@shared/schema';
import { useWeb3 } from '@/contexts/Web3Context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DonationPanelProps {
  poolSize: string;
  onDonate: (amount: string) => Promise<void>;
}

export function DonationPanel({ poolSize, onDonate }: DonationPanelProps) {
  const { wallet } = useWeb3();
  const { toast } = useToast();
  const [isDonating, setIsDonating] = useState(false);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: '',
    },
  });

  const onSubmit = async (data: DonationInput) => {
    if (!wallet.connected) {
      toast({
        variant: 'destructive',
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
      });
      return;
    }

    setIsDonating(true);
    try {
      await onDonate(data.amount);
      setValue('amount', '');
      toast({
        title: 'Donation Successful!',
        description: `You donated ${data.amount} CELO to the pool`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Donation Failed',
        description: error.message || 'Failed to process donation',
      });
    } finally {
      setIsDonating(false);
    }
  };

  const setMaxAmount = () => {
    if (wallet.balance) {
      const maxAmount = Math.max(0, parseFloat(wallet.balance) - 0.01).toFixed(4);
      setValue('amount', maxAmount);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Donation Pool
            </CardTitle>
            <CardDescription>
              Support the SmileChain community
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-2 text-lg px-3 py-1.5">
            <Coins className="h-4 w-4" />
            {parseFloat(poolSize).toFixed(2)} CELO
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Donation Amount (CELO)</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.001"
                placeholder="0.00"
                {...register('amount')}
                disabled={!wallet.connected || isDonating}
                data-testid="input-donation-amount"
              />
              <Button
                type="button"
                variant="outline"
                onClick={setMaxAmount}
                disabled={!wallet.connected || isDonating}
                data-testid="button-max"
              >
                MAX
              </Button>
            </div>
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full gap-2"
            disabled={!wallet.connected || isDonating}
            data-testid="button-donate"
          >
            <Heart className="h-4 w-4" />
            {isDonating ? 'Processing...' : 'Donate to Pool'}
          </Button>

          {!wallet.connected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet to donate
            </p>
          )}
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">How It Works</h4>
          <p className="text-xs text-muted-foreground">
            Donations are pooled and periodically redistributed to the top smile scorers on the leaderboard.
            The more you donate, the bigger the rewards for winners!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
