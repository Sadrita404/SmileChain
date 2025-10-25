import { Wallet, LogOut, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/contexts/Web3Context';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const { wallet, connect, disconnect } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: 'Wallet Connected',
        description: 'Successfully connected to Celo Alfajores',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!wallet.connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={isConnecting}
        size="default"
        className="gap-2"
        data-testid="button-connect-wallet"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" data-testid="button-wallet-menu">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">{formatAddress(wallet.address!)}</span>
          <Badge variant="secondary" className="ml-2">
            {parseFloat(wallet.balance).toFixed(2)} CELO
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-2 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Address</span>
            <span className="font-mono text-xs">{formatAddress(wallet.address!)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Network</span>
            <Badge variant="outline" className="gap-1">
              {wallet.network === 'Celo Alfajores' ? (
                <>✓ {wallet.network}</>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  {wallet.network}
                </>
              )}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Balance</span>
            <span className="font-semibold">{parseFloat(wallet.balance).toFixed(4)} CELO</span>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="gap-2 text-destructive" data-testid="button-disconnect">
          <LogOut className="h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
