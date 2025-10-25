import Web3 from 'web3';

// Celo Alfajores testnet configuration
export const ALFAJORES_CHAINID = 44787;
export const ALFAJORES_RPC = 'https://alfajores-forno.celo-testnet.org';

// Smart contract address (to be deployed)
// ⚠️ DEPLOYMENT REQUIRED: This is a placeholder address
// Deploy SmileChain.sol to Celo Alfajores and update this address
// See DEPLOYMENT_GUIDE.md for instructions
export const SMILECHAIN_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Placeholder - UPDATE AFTER DEPLOYMENT

let web3Instance: Web3 | null = null;

export function getWeb3(): Web3 {
  if (!window.ethereum) {
    throw new Error('Please install MetaMask or a compatible Web3 wallet');
  }
  
  if (!web3Instance) {
    web3Instance = new Web3(window.ethereum);
  }
  
  return web3Instance;
}

export async function connectWallet(): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Please install MetaMask or a compatible Web3 wallet');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // Switch to Alfajores testnet
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${ALFAJORES_CHAINID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // Chain not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${ALFAJORES_CHAINID.toString(16)}`,
              chainName: 'Celo Alfajores Testnet',
              nativeCurrency: {
                name: 'Celo',
                symbol: 'CELO',
                decimals: 18,
              },
              rpcUrls: [ALFAJORES_RPC],
              blockExplorerUrls: ['https://explorer.celo.org/alfajores'],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

export async function getBalance(address: string): Promise<string> {
  const web3 = getWeb3();
  const balanceWei = await web3.eth.getBalance(address);
  return web3.utils.fromWei(balanceWei, 'ether');
}

export async function getCurrentNetwork(): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    return 'Not Connected';
  }

  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  const chainIdNum = parseInt(chainId, 16);
  
  if (chainIdNum === ALFAJORES_CHAINID) {
    return 'Celo Alfajores';
  }
  
  return 'Unknown Network';
}

// Contract ABI - Full SmileChain contract interface
export const SMILECHAIN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "from", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "DonationReceived",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "PoolRedistributed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "name": "RewardClaimed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "score", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "SmileScored",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "donationPool",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "emergencyWithdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLeaderboard",
    "outputs": [
      {"internalType": "address[]", "name": "addresses", "type": "address[]"},
      {"internalType": "uint256[]", "name": "scores", "type": "uint256[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTimeUntilRedistribution",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "getUserInfo",
    "outputs": [
      {"internalType": "uint256", "name": "bestScore", "type": "uint256"},
      {"internalType": "uint256", "name": "totalRewards", "type": "uint256"},
      {"internalType": "uint256", "name": "lastClaimTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "leaderboard",
    "outputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "score", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lastRedistribution",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MAX_LEADERBOARD_SIZE",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "MIN_SCORE_FOR_REWARD",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "redistributePool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REDISTRIBUTION_INTERVAL",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "REWARD_AMOUNT",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "score", "type": "uint256"}],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "users",
    "outputs": [
      {"internalType": "uint256", "name": "bestScore", "type": "uint256"},
      {"internalType": "uint256", "name": "totalRewards", "type": "uint256"},
      {"internalType": "uint256", "name": "lastClaimTime", "type": "uint256"},
      {"internalType": "bool", "name": "hasScore", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

declare global {
  interface Window {
    ethereum?: any;
  }
}
