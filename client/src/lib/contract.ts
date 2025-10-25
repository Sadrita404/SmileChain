import { SMILECHAIN_CONTRACT_ADDRESS, SMILECHAIN_ABI } from './web3';
import Web3 from 'web3';
import { LeaderboardEntry } from '@shared/schema';

let web3: Web3 | null = null;
let contract: any = null;

function checkContractDeployed() {
  if (SMILECHAIN_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
    throw new Error(
      'Smart contract not deployed yet. Please deploy SmileChain.sol to Celo Alfajores testnet and update the contract address in client/src/lib/web3.ts. See DEPLOYMENT_GUIDE.md for instructions.'
    );
  }
}

export function initializeContract() {
  checkContractDeployed();
  
  if (!window.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask or a compatible Web3 wallet.');
  }

  web3 = new Web3(window.ethereum);
  contract = new web3.eth.Contract(SMILECHAIN_ABI as any, SMILECHAIN_CONTRACT_ADDRESS);
  
  return contract;
}

export async function submitSmileScore(address: string, score: number): Promise<string> {
  if (!contract) initializeContract();
  
  const tx = await contract.methods.submitScore(score).send({
    from: address,
    gas: 300000,
  });
  
  return tx.transactionHash;
}

export async function donateToPool(address: string, amountInCelo: string): Promise<string> {
  if (!contract) initializeContract();
  if (!web3) throw new Error('Web3 not initialized');
  
  const amountInWei = web3.utils.toWei(amountInCelo, 'ether');
  
  const tx = await contract.methods.donate().send({
    from: address,
    value: amountInWei,
    gas: 100000,
  });
  
  return tx.transactionHash;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!contract) initializeContract();
  if (!web3) throw new Error('Web3 not initialized');
  
  const result = await contract.methods.getLeaderboard().call();
  const addresses = result[0];
  const scores = result[1];
  
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 0; i < addresses.length; i++) {
    const userInfo = await contract.methods.getUserInfo(addresses[i]).call();
    
    entries.push({
      address: addresses[i],
      score: Number(scores[i]),
      tokensEarned: web3.utils.fromWei(userInfo.totalRewards.toString(), 'ether'),
      rank: i + 1,
    });
  }
  
  return entries;
}

export async function getDonationPoolSize(): Promise<string> {
  if (!contract) initializeContract();
  if (!web3) throw new Error('Web3 not initialized');
  
  const poolSizeWei = await contract.methods.donationPool().call();
  return web3.utils.fromWei(poolSizeWei.toString(), 'ether');
}

export async function getUserInfo(address: string) {
  if (!contract) initializeContract();
  if (!web3) throw new Error('Web3 not initialized');
  
  const info = await contract.methods.getUserInfo(address).call();
  
  return {
    bestScore: Number(info.bestScore),
    totalRewards: web3.utils.fromWei(info.totalRewards.toString(), 'ether'),
    lastClaimTime: Number(info.lastClaimTime),
  };
}

export async function getTimeUntilRedistribution(): Promise<number> {
  if (!contract) initializeContract();
  
  const timeInSeconds = await contract.methods.getTimeUntilRedistribution().call();
  return Number(timeInSeconds);
}

export async function redistributePool(address: string): Promise<string> {
  if (!contract) initializeContract();
  
  const tx = await contract.methods.redistributePool().send({
    from: address,
    gas: 500000,
  });
  
  return tx.transactionHash;
}
