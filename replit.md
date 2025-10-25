# SmileChain - Decentralized Smile-to-Earn dApp

## Overview
SmileChain is a fully decentralized application built on the Celo blockchain that rewards users with tokens for capturing great smiles. The app uses on-device AI (TensorFlow.js) to score smiles and automatically rewards high scorers with Celo tokens via smart contracts.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain**: Celo Alfajores Testnet, Solidity
- **Web3**: Celo ContractKit, Web3.js
- **AI/ML**: TensorFlow.js, BlazeFace model
- **Camera**: react-webcam

## Architecture
This is a **fully decentralized application** with no traditional backend:
- All business logic runs either client-side (React) or on-chain (Solidity smart contracts)
- Smile detection happens on-device using TensorFlow.js
- Token rewards and donations are handled by smart contracts
- No centralized server or database

## Project Structure
```
client/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── WalletConnect.tsx       # Celo wallet connection
│   │   ├── CameraCapture.tsx       # Webcam selfie capture
│   │   ├── SmileScore.tsx          # Score display with animations
│   │   ├── DonationPanel.tsx       # Donation pool interface
│   │   ├── Leaderboard.tsx         # Top scorers ranking
│   │   └── StatsPanel.tsx          # Personal statistics
│   ├── contexts/
│   │   └── Web3Context.tsx         # Web3 state management
│   ├── lib/
│   │   └── web3.ts                 # Celo/Web3 utilities
│   ├── pages/
│   │   ├── Home.tsx                # Main application page
│   │   └── not-found.tsx           # 404 page
│   └── App.tsx                     # Root component with providers
shared/
└── schema.ts                       # TypeScript interfaces & constants
contracts/                          # Solidity smart contracts (to be added)
```

## Key Features
1. **Wallet Connection**: MetaMask integration with Celo Alfajores testnet
2. **Camera Capture**: Live webcam feed with face positioning guide
3. **AI Smile Scoring**: TensorFlow.js model scores smiles 0-100
4. **Automatic Rewards**: Smart contract mints tokens for scores ≥80
5. **Donation Pool**: Users can donate tokens to a shared pool
6. **Leaderboard**: Top 10 smile scorers with rankings
7. **Periodic Redistribution**: Pool funds distributed to top scorers

## Smart Contract (To Be Deployed)
The SmileChain contract will handle:
- Token minting for reward claims
- Donation pool management
- Leaderboard tracking
- Periodic redistribution logic

Contract address placeholder: `0x0000000000000000000000000000000000000000`

## Development Status
- [x] Frontend components and UI
- [x] Smart contract development (SmileChain.sol)
- [x] TensorFlow.js integration for smile detection
- [x] Web3 contract interactions (ContractKit + Web3.js)
- [ ] Smart contract deployment to Celo Alfajores (deployment instructions provided)
- [ ] End-to-end testing with deployed contract

## Recent Changes
- 2025-10-23: Initial project setup
- 2025-10-23: All frontend components created with vibrant, playful design
- 2025-10-23: Web3 context and Celo wallet integration implemented
- 2025-10-23: SmileChain Solidity contract written with full feature set
- 2025-10-23: TensorFlow.js smile detection using BlazeFace model integrated
- 2025-10-23: Complete Web3 integration with automatic reward claiming

## Contract Deployment
The smart contract is ready for deployment. To deploy:
1. Follow instructions in `contracts/DEPLOYMENT.md`
2. Deploy to Celo Alfajores testnet using Hardhat
3. Update the contract address in `client/src/lib/web3.ts`
4. Fund the contract with test CELO for rewards

**Note**: The app currently uses a placeholder contract address. For full functionality, deploy the contract and update the address.

## Design Guidelines
- **Color Scheme**: Vibrant green primary (Celo brand), warm yellow accents
- **Typography**: Inter for body, Space Grotesk for display/scores
- **Layout**: Responsive 2-column layout (camera left, stats/leaderboard right)
- **Interactions**: Smooth animations for score reveals and rewards
- **Accessibility**: Camera permissions, keyboard navigation, ARIA labels

## Environment Variables
None required - fully decentralized. Users connect their own wallets.

## Running the Project
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Connect wallet to Celo Alfajores testnet
4. Allow camera permissions
5. Capture smiles and earn rewards!

## Next Steps
1. Write and deploy Solidity smart contract
2. Integrate TensorFlow.js for real smile detection
3. Connect frontend to deployed contract
4. Test all user flows end-to-end
