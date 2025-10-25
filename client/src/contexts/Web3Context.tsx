import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WalletState } from '@shared/schema';
import { connectWallet, getBalance, getCurrentNetwork } from '@/lib/web3';

interface Web3ContextType {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    connected: false,
    balance: '0',
    network: 'Not Connected',
  });

  const connect = async () => {
    try {
      const address = await connectWallet();
      const balance = await getBalance(address);
      const network = await getCurrentNetwork();

      setWallet({
        address,
        connected: true,
        balance,
        network,
      });
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setWallet({
      address: null,
      connected: false,
      balance: '0',
      network: 'Not Connected',
    });
  };

  const refreshBalance = async () => {
    if (wallet.address) {
      const balance = await getBalance(wallet.address);
      setWallet(prev => ({ ...prev, balance }));
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== wallet.address) {
          connect();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [wallet.address]);

  return (
    <Web3Context.Provider value={{ wallet, connect, disconnect, refreshBalance }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
