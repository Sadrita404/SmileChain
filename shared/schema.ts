import { z } from "zod";

// Web3 & Wallet Types
export interface WalletState {
  address: string | null;
  connected: boolean;
  balance: string;
  network: string;
}

export interface SmileScore {
  score: number;
  timestamp: number;
  rewarded: boolean;
  transactionHash?: string;
}

export interface LeaderboardEntry {
  address: string;
  score: number;
  tokensEarned: string;
  rank: number;
}

export interface DonationPoolInfo {
  totalPool: string;
  nextRedistribution: number;
  lastRedistribution: number;
}

export interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

// Smart Contract Event Types
export interface RewardEvent {
  address: string;
  amount: string;
  smileScore: number;
  timestamp: number;
}

export interface DonationEvent {
  from: string;
  amount: string;
  timestamp: number;
}

// Validation Schemas
export const donationSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
});

export type DonationInput = z.infer<typeof donationSchema>;

// Constants
export const SMILE_REWARD_THRESHOLD = 80;
export const REWARD_AMOUNT = "0.1"; // 0.1 Celo tokens
export const MAX_LEADERBOARD_SIZE = 10;
