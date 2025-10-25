# 🌟 SmileChain - Decentralized Smile-to-Earn dApp

Turn your smile into crypto! SmileChain is a fully decentralized application built on the Celo blockchain that rewards users with tokens for their best smiles.

## ✨ Features

- 📸 **Selfie Capture**: Use your camera to capture your best smile
- 🤖 **AI Smile Scoring**: On-device TensorFlow.js model scores your smile (0-100)
- 💰 **Automatic Rewards**: Score 80+ to earn 0.1 CELO automatically
- ❤️ **Donation Pool**: Contribute to a community reward pool
- 🏆 **Leaderboard**: Compete for the top smile scores
- ⏰ **Weekly Redistribution**: Donated funds distributed to top scorers
- 🔐 **Fully Decentralized**: No backend server - all logic runs on-device or on-chain

## 🎯 How It Works

1. **Connect your Celo wallet** (MetaMask with Alfajores testnet)
2. **Capture a selfie** using your device's camera
3. **AI scores your smile** using BlazeFace + custom smile detection
4. **Earn rewards** if your score is 80 or higher (0.1 CELO per smile)
5. **Climb the leaderboard** and win weekly pool redistributions

## 🚀 Quick Start

### For Users

1. **Visit the app** (once deployed)
2. **Add Celo Alfajores** network to MetaMask
3. **Get test CELO** from [faucet.celo.org](https://faucet.celo.org/alfajores)
4. **Connect wallet** and start smiling!

### For Developers

#### Prerequisites
- Node.js 20+
- MetaMask or compatible Web3 wallet
- Test CELO from Alfajores faucet

#### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd smilechain

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Deploy Smart Contract
⚠️ **Required for full functionality**

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

Quick version:
```bash
# Install Hardhat
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Deploy to Alfajores
export PRIVATE_KEY="your-private-key"
npx hardhat run scripts/deploy.js --network alfajores

# Update contract address in client/src/lib/web3.ts
```

## 🏗️ Tech Stack

### Frontend
- **React** + **TypeScript** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **TanStack Query** - Data fetching & caching
- **Wouter** - Lightweight routing

### Blockchain
- **Celo** - Carbon-negative, mobile-first blockchain
- **Solidity** - Smart contract language
- **Web3.js** + **ContractKit** - Blockchain interaction
- **Hardhat** - Smart contract development

### AI/ML
- **TensorFlow.js** - On-device machine learning
- **BlazeFace** - Face detection model
- **react-webcam** - Camera access

## 📁 Project Structure

```
smilechain/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Web3)
│   │   ├── lib/              # Utilities (Web3, ML, contracts)
│   │   └── pages/            # Application pages
├── contracts/                 # Solidity smart contracts
│   ├── SmileChain.sol        # Main contract
│   └── DEPLOYMENT.md         # Deployment instructions
├── shared/                    # Shared TypeScript types
└── server/                    # Vite dev server only (no backend logic)
```

## 🎨 Design Philosophy

SmileChain combines **playful gamification** with **professional crypto UX**:

- **Vibrant colors**: Green (Celo brand) + warm yellow accents
- **Smooth animations**: Score count-ups, reward celebrations
- **Clear feedback**: Instant visual response to all actions
- **Accessibility**: Camera permissions, keyboard nav, ARIA labels
- **Mobile-first**: Responsive design for all devices

## 🔐 Security

- ✅ On-device AI processing (photos never leave your device)
- ✅ Rate limiting (1 reward per wallet per day)
- ✅ Non-custodial (you control your wallet)
- ✅ Open source smart contracts
- ✅ Testnet deployment recommended before mainnet

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Alfajores
5. Submit a pull request

## 📜 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Documentation**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Contract Details**: See [contracts/DEPLOYMENT.md](./contracts/DEPLOYMENT.md)
- **Celo Docs**: https://docs.celo.org
- **Issues**: Open a GitHub issue

## 🌍 Roadmap

- [x] MVP: Smile detection + token rewards
- [x] Donation pool system
- [x] Leaderboard & redistribution
- [ ] Deploy to Celo Alfajores
- [ ] NFT badges for high scorers
- [ ] Social sharing features
- [ ] Governance token for pool rules
- [ ] Mainnet deployment

## 🙏 Acknowledgments

- Built on [Celo](https://celo.org) - Mobile-first, carbon-negative blockchain
- Powered by [TensorFlow.js](https://www.tensorflow.org/js) - ML in the browser
- Inspired by smile detection research and gamification principles

---

**Made with ❤️ for the Celo community**

*Remember: Your smile is valuable - let's prove it!* 😊
