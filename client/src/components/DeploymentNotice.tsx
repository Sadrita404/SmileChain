import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { SMILECHAIN_CONTRACT_ADDRESS } from '@/lib/web3';

export function DeploymentNotice() {
  const isDeployed = SMILECHAIN_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  if (isDeployed) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle className="font-semibold text-lg">Smart Contract Not Deployed</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm">
          The SmileChain smart contract needs to be deployed to Celo Alfajores testnet before you can earn rewards.
          All blockchain features (scoring, donations, leaderboard) will be unavailable until deployment.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open('https://github.com/yourusername/smilechain/blob/main/DEPLOYMENT_GUIDE.md', '_blank')}
            data-testid="link-deployment-guide"
          >
            <ExternalLink className="h-4 w-4" />
            View Deployment Guide
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.open('https://faucet.celo.org/alfajores', '_blank')}
            data-testid="link-celo-faucet"
          >
            <ExternalLink className="h-4 w-4" />
            Get Test CELO
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          <strong>Note:</strong> You can still test the camera and smile detection features without deployment.
        </p>
      </AlertDescription>
    </Alert>
  );
}
