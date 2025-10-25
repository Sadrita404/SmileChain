# SmileChain Smart Contract Deployment Guide

## Prerequisites
1. Install Node.js and npm
2. Install Hardhat: `npm install --save-dev hardhat`
3. Get Celo Alfajores testnet CELO from faucet: https://faucet.celo.org/alfajores
4. Have MetaMask or Celo Wallet with Alfajores network configured

## Setup

### 1. Initialize Hardhat Project
```bash
npx hardhat init
# Select "Create a JavaScript project"
```

### 2. Install Dependencies
```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts
```

### 3. Configure Hardhat for Celo Alfajores

Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

// Replace with your private key (NEVER commit this!)
const PRIVATE_KEY = process.env.PRIVATE_KEY || "your-private-key-here";

module.exports = {
  solidity: "0.8.20",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [PRIVATE_KEY],
      chainId: 44787,
    },
  },
};
```

### 4. Create Deployment Script

Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying SmileChain contract to Celo Alfajores...");

  const SmileChain = await hre.ethers.getContractFactory("SmileChain");
  const smileChain = await SmileChain.deploy();

  await smileChain.waitForDeployment();

  const address = await smileChain.getAddress();
  console.log("SmileChain deployed to:", address);

  // Fund the contract with some CELO for rewards
  const fundAmount = hre.ethers.parseEther("1.0"); // 1 CELO
  const [deployer] = await hre.ethers.getSigners();
  
  console.log("Funding contract with 1 CELO for rewards...");
  const tx = await deployer.sendTransaction({
    to: address,
    value: fundAmount,
  });
  await tx.wait();

  console.log("Contract funded successfully!");
  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Contract Address:", address);
  console.log("Network: Celo Alfajores Testnet");
  console.log("Explorer:", `https://explorer.celo.org/alfajores/address/${address}`);
  console.log("\nUpdate the contract address in client/src/lib/web3.ts:");
  console.log(`export const SMILECHAIN_CONTRACT_ADDRESS = '${address}';`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Deployment Steps

### 1. Set Private Key
```bash
export PRIVATE_KEY="your-wallet-private-key"
```

**Security Warning**: NEVER commit your private key to git! Use environment variables or `.env` files (add to `.gitignore`).

### 2. Compile Contract
```bash
npx hardhat compile
```

### 3. Deploy to Alfajores
```bash
npx hardhat run scripts/deploy.js --network alfajores
```

### 4. Update Frontend
Copy the deployed contract address and update it in `client/src/lib/web3.ts`:

```typescript
export const SMILECHAIN_CONTRACT_ADDRESS = '0xYourDeployedContractAddress';
```

## Verify Contract (Optional)

To verify your contract on the Celo blockchain explorer:

```bash
npx hardhat verify --network alfajores DEPLOYED_CONTRACT_ADDRESS
```

## Contract Interaction Examples

### Read Functions (No gas required)
```javascript
// Get leaderboard
const [addresses, scores] = await contract.getLeaderboard();

// Get user info
const [bestScore, totalRewards, lastClaimTime] = await contract.getUserInfo(userAddress);

// Get donation pool size
const poolSize = await contract.donationPool();

// Get time until redistribution
const timeLeft = await contract.getTimeUntilRedistribution();
```

### Write Functions (Requires gas)
```javascript
// Submit a smile score
await contract.submitScore(85); // Score between 0-100

// Donate to pool
await contract.donate({ value: ethers.parseEther("0.5") });

// Redistribute pool (anyone can call after interval)
await contract.redistributePool();
```

## Contract Features

- **Automatic Rewards**: Scores ≥80 automatically receive 0.1 CELO
- **Rate Limiting**: One reward per wallet per day
- **Leaderboard**: Top 10 scores tracked on-chain
- **Donation Pool**: Community-funded reward pool
- **Redistribution**: Weekly distribution to top scorers
  - 40% to 1st place
  - 30% to 2nd place
  - 20% to 3rd place
  - 10% split among 4th-10th

## Troubleshooting

### Insufficient Funds
Make sure your deployer wallet has enough CELO from the faucet.

### Gas Estimation Failed
Check that you're connected to Alfajores and have the correct RPC URL.

### Contract Already Deployed
If you need to redeploy, just run the deploy script again. It will create a new instance.

## Testing Locally (Optional)

Test on Hardhat's local network first:

```bash
# Start local node
npx hardhat node

# Deploy to local network (in another terminal)
npx hardhat run scripts/deploy.js --network localhost
```

## Resources

- [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
- [Celo Explorer](https://explorer.celo.org/alfajores)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Celo Documentation](https://docs.celo.org/)
