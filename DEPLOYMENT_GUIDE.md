# SmileChain Deployment Guide

## Current Status
✅ **Complete**: Frontend UI, TensorFlow.js integration, Web3 setup, Smart contract code  
⚠️ **Required**: Smart contract deployment to Celo Alfajores testnet

## Why Deployment is Needed
The application currently points to a placeholder contract address (`0x000...000`). To make SmileChain fully functional, you must:

1. **Deploy the SmileChain.sol contract** to Celo Alfajores testnet
2. **Update the contract address** in the frontend
3. **Fund the contract** with test CELO for rewards

Without deployment, all blockchain interactions (scoring, rewards, donations, leaderboard) will fail.

## Reward Model
SmileChain uses **native CELO tokens** (not a custom ERC-20) for rewards:
- Users who score ≥80 automatically receive 0.1 CELO
- Rewards come from the contract's balance (pre-funded + donations)
- This is simpler and more gas-efficient than minting custom tokens
- The donation pool allows community-funded sustainability

## Quick Start Deployment

### Prerequisites
- MetaMask or compatible wallet
- Test CELO from [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
- Node.js and npm installed

### Step 1: Install Hardhat
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
# Select "Create a JavaScript project"
```

### Step 2: Configure Hardhat
Edit `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");

// IMPORTANT: Use environment variable for private key
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 44787,
    },
  },
};
```

### Step 3: Create Deployment Script
Create `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SmileChain to Celo Alfajores...\n");

  // Deploy contract
  const SmileChain = await hre.ethers.getContractFactory("SmileChain");
  const smileChain = await SmileChain.deploy();
  await smileChain.waitForDeployment();

  const address = await smileChain.getAddress();
  console.log("✅ SmileChain deployed to:", address);

  // Fund contract with 2 CELO for rewards
  const [deployer] = await hre.ethers.getSigners();
  const fundAmount = hre.ethers.parseEther("2.0");
  
  console.log("\n💰 Funding contract with 2 CELO...");
  const tx = await deployer.sendTransaction({
    to: address,
    value: fundAmount,
  });
  await tx.wait();
  console.log("✅ Contract funded successfully!");

  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Contract Address:", address);
  console.log("Network: Celo Alfajores Testnet");
  console.log("Explorer:", `https://explorer.celo.org/alfajores/address/${address}`);
  console.log("Initial Funding: 2 CELO");
  console.log("Reward per smile (≥80): 0.1 CELO");
  console.log("Estimated rewards: ~20 smiles");
  console.log("=".repeat(60));
  
  console.log("\n📝 NEXT STEP:");
  console.log("Update this address in client/src/lib/web3.ts:");
  console.log(`export const SMILECHAIN_CONTRACT_ADDRESS = '${address}';`);
  console.log("\n✨ Then restart the app and start earning rewards!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 4: Copy Contract
```bash
cp contracts/SmileChain.sol contracts/SmileChain.sol
```

### Step 5: Deploy
```bash
# Set your private key (NEVER commit this!)
export PRIVATE_KEY="your-wallet-private-key-here"

# Compile
npx hardhat compile

# Deploy to Alfajores
npx hardhat run scripts/deploy.js --network alfajores
```

### Step 6: Update Frontend
Copy the deployed contract address and update `client/src/lib/web3.ts`:

```typescript
export const SMILECHAIN_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_ADDRESS_HERE';
```

### Step 7: Restart App
```bash
npm run dev
```

## Testing the Application

1. **Connect Wallet**
   - Click "Connect Wallet" in top right
   - Approve connection in MetaMask
   - Ensure you're on Celo Alfajores network

2. **Capture Smile**
   - Allow camera permissions
   - Position face in oval guide
   - Click "Capture Smile"
   - AI will analyze and score your smile

3. **Earn Rewards**
   - Scores ≥80 automatically trigger 0.1 CELO reward
   - Reward is sent directly to your wallet
   - Check your balance in wallet dropdown

4. **Donate to Pool**
   - Enter CELO amount to donate
   - Click "Donate to Pool"
   - Approve transaction in MetaMask

5. **View Leaderboard**
   - Top 10 scorers displayed
   - Your position highlighted if in top 10
   - Shows tokens earned by each user

## Funding the Contract
The contract needs CELO to pay rewards:

### Initial Funding (Done in deployment script)
```javascript
// Send CELO to contract
const tx = await signer.sendTransaction({
  to: contractAddress,
  value: ethers.parseEther("2.0"), // 2 CELO
});
```

### Add More Funds Later
```javascript
// Via MetaMask: Send CELO directly to contract address
// Or programmatically:
await signer.sendTransaction({
  to: "0xYourContractAddress",
  value: ethers.parseEther("5.0"),
});
```

### Check Contract Balance
```javascript
const balance = await ethers.provider.getBalance(contractAddress);
console.log("Contract balance:", ethers.formatEther(balance), "CELO");
```

## Sustainability Model
SmileChain has two funding sources:

1. **Initial Funding**: Owner funds contract with CELO
2. **Community Donations**: Users donate to pool, which gets redistributed weekly

This hybrid model ensures:
- Immediate rewards for high scorers (from contract balance)
- Community-driven sustainability (from donation pool)
- Weekly redistribution creates ongoing engagement

## Troubleshooting

### "Insufficient contract balance" Error
Contract ran out of CELO. Send more CELO to the contract address.

### "Can only claim once per day" Error
Rate limiting prevents spam. Wait 24 hours between reward claims.

### Transaction Failed
- Check you have enough CELO for gas fees
- Ensure you're on Alfajores network
- Verify contract address is correct

### Camera Not Working
- Allow camera permissions in browser
- Use HTTPS or localhost (required for getUserMedia)
- Check camera is not used by another app

## Security Notes
- ⚠️ Never commit your private key to git
- ✅ Use environment variables for sensitive data
- ✅ Test thoroughly on Alfajores before mainnet
- ✅ The contract includes emergency withdraw for owner

## Alternative: Custom ERC-20 Token
If you prefer a custom token instead of native CELO:

1. Deploy an ERC-20 token contract
2. Modify SmileChain to mint tokens instead of sending CELO
3. Update reward logic to call `token.mint(user, amount)`

This adds complexity but provides unlimited supply. The current native CELO approach is simpler and more gas-efficient.

## Resources
- [Celo Documentation](https://docs.celo.org/)
- [Celo Alfajores Faucet](https://faucet.celo.org/alfajores)
- [Celo Explorer](https://explorer.celo.org/alfajores)
- [Hardhat Documentation](https://hardhat.org/)
- [MetaMask](https://metamask.io/)

## Support
For detailed contract documentation, see `contracts/DEPLOYMENT.md`
For Solidity code, see `contracts/SmileChain.sol`
